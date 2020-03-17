import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { CreateCouponDTO } from './coupon.dto';
import { ICoupon } from './coupon.interfaces';
import { IUser } from '../user/user.interfaces';
import { UserCouponService } from '../userCoupon/userCoupon.service';
import { CreateUserCouponDTO } from '../userCoupon/userCoupon.dto';
import { UserService } from '../user/user.service';
import { concatMap } from 'rxjs/operators';

@Injectable()
export class CouponService {
  constructor(
    @Inject('CouponModelToken') private readonly couponModel: Model<ICoupon>,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
    @Inject(UserCouponService) private readonly userCouponService: UserCouponService,
    @Inject(UserService) private readonly userService: UserService,
  ) { }

  // 创建数据
  async create(createCouponDTO: CreateCouponDTO, user: string): Promise<ICoupon> {
    return await this.couponModel.create({ ...createCouponDTO, createBy: user })
  }

  // 新人红包/优惠券
  async newUser() {
    return await this.couponModel
      .find({ target: 2, isDelete: false, $where: 'this.count >= this.receiveCount', expire: { $gte: Date.now() } })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async coupons(type: number, user: IUser): Promise<IList<ICoupon>> {
    const condition: any = {}
    condition.type = type
    condition.isDelete = false
    condition.expire = { $gte: Date.now() }
    condition.$or = [{
      target: 1
    }, { target: 3, users: user._id }]
    if (user.isVip) {
      condition.$or.push({ target: 4 })
    }
    condition.$where = 'this.count >= this.receiveCount'
    return await this.couponModel
      .find(condition)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async list(pagination: Pagination): Promise<IList<ICoupon>> {
    const condition = this.paginationUtil.genCondition(pagination, []);
    const list = await this.couponModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    const total = await this.couponModel.countDocuments(condition);
    return { list, total };
  }

  // 修改数据
  async update(id: string, createCouponDTO: CreateCouponDTO): Promise<ICoupon | null> {
    return await this.couponModel.findByIdAndUpdate(id, createCouponDTO)
  }

  // 详情
  async detail(id: string): Promise<ICoupon> {
    const coupon = await this.couponModel.findById(id).lean().exec();
    if (!coupon) {
      throw new ApiException('数据不存在', ApiErrorCode.NO_EXIST, 404)
    }
    return coupon
  }

  // 软删除
  async remove(id: string, user: string) {
    return await this.couponModel.findByIdAndUpdate(id, { isDelete: true, deleteTime: Date.now(), deleteBy: user });
  }

  // 恢复
  async recover(id: string) {
    return await this.couponModel.findByIdAndUpdate(id, { isDelete: false, $unset: { deleteTime: 1, deleteBy: 1 } });
  }

  // 领取红包
  async getCoupon(id: string, user: IUser) {
    const coupon = await this.couponModel.findById(id)
    if (!coupon) {
      throw new ApiException('红包不存在', ApiErrorCode.NO_EXIST, 404)
    }
    if (coupon.count <= coupon.receiveCount) {
      throw new ApiException('红包已领完', ApiErrorCode.NO_EXIST, 403)
    }
    const exist = await this.userCouponService.findOne({ user: user._id, coupon: id })
    if (exist) {
      throw new ApiException('红包已领取', ApiErrorCode.EXIST, 403)
    }
    if (coupon.target === 3 && !coupon.users.find(o => String(o) === String(user._id))) {
      throw new ApiException('无权限领取', ApiErrorCode.NO_PERMISSION, 403)
    }
    if (coupon.target === 4 && !user.isVip) {
      throw new ApiException('无权限领取', ApiErrorCode.NO_PERMISSION, 403)
    }
    const newUserCoupon: CreateUserCouponDTO = {
      user: user._id,
      useType: coupon.useType,
      goods: coupon.goods,
      categories: coupon.categories,
      type: coupon.type,
      name: coupon.name,
      limit: coupon.limit,
      isLimit: coupon.isLimit,
      amount: coupon.amount,
      expire: coupon.expire,
      coupon: coupon._id
    }
    await this.userCouponService.create(newUserCoupon)
    await this.couponModel.findByIdAndUpdate(id, { $inc: { receiveCount: 1 } })
    return 'success'
  }

  // 获取新人红包/优惠券
  async getPacket(user: IUser) {
    const condition: any = {}
    condition.isDelete = false
    condition.expire = { $gte: Date.now() }
    condition.$where = 'this.count >= this.receiveCount'
    condition.$or = [{
      target: 1,
      type: 2,
    }, { target: 3, type: 2, users: user._id }]
    if (user.isVip) {
      condition.$or.push({ target: 4, type: 2 })
    }

    if (user.isNewUser) {
      condition.$or.push({ target: 2 })
    }
    const coupons = await this.couponModel
      .find(condition)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    await Promise.all(coupons.map(async coupon => {
      const exist = await this.userCouponService.findOne({ coupon: coupon._id, user: user._id })
      if (exist) {
        return
      }
      const newUserCoupon: CreateUserCouponDTO = {
        user: user._id,
        useType: coupon.useType,
        goods: coupon.goods,
        categories: coupon.categories,
        type: coupon.type,
        name: coupon.name,
        limit: coupon.limit,
        isLimit: coupon.isLimit,
        amount: coupon.amount,
        expire: coupon.expire,
        coupon: coupon._id,
      }
      await this.userCouponService.create(newUserCoupon)
      await this.couponModel.findByIdAndUpdate(coupon._id, { $inc: { receiveCount: 1 } })
    }))
    await this.userService.updateById(user._id, { isNewUser: false })
    return 'success'
  }

}