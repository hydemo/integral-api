import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { CreateUserCouponDTO } from './userCoupon.dto';
import { IUserCoupon } from './userCoupon.interfaces';

@Injectable()
export class UserCouponService {
  constructor(
    @Inject('UserCouponModelToken') private readonly userCouponModel: Model<IUserCoupon>,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
  ) { }

  // 创建数据
  async create(createUserCouponDTO: CreateUserCouponDTO): Promise<IUserCoupon> {
    return await this.userCouponModel.create(createUserCouponDTO)
  }

  // 分页查询数据
  async list(pagination: Pagination, type: number, tab: number, user: string): Promise<IList<IUserCoupon>> {
    const condition = this.paginationUtil.genCondition(pagination, []);
    condition.user = user
    condition.type = type
    switch (tab) {
      case 1:
        { condition.isUsed = false; condition.expire = { $gt: Date.now() } }
        break;
      case 2:
        { condition.isUsed = true }
        break;
      case 3:
        { condition.isUsed = false; condition.expire = { $lte: Date.now() } }
        break;
      default:
        { condition.isUsed = false; condition.expire = { $gt: Date.now() } }
        break;
    }
    const list = await this.userCouponModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .sort({ isUsed: -1, createdAt: -1 })
      .lean()
      .exec();
    const total = await this.userCouponModel.countDocuments(condition);
    return { list, total };
  }

  async all(user): Promise<IUserCoupon[]> {
    return await this.userCouponModel.find({ user })
  }

  // 修改数据
  async update(id: string, createUserCouponDTO: CreateUserCouponDTO): Promise<IUserCoupon | null> {
    return await this.userCouponModel.findByIdAndUpdate(id, createUserCouponDTO)
  }

  // 详情
  async detail(id: string): Promise<IUserCoupon> {
    const userCoupon = await this.userCouponModel.findById(id).lean().exec();
    if (!userCoupon) {
      throw new ApiException('数据不存在', ApiErrorCode.NO_EXIST, 404)
    }
    return userCoupon
  }

  // 根据id查找单个红包
  async findOne(condition: any): Promise<IUserCoupon> {
    return await this.userCouponModel.findOne(condition).lean().exec();
  }
  // 根据id查找单个红包
  async findById(id: string): Promise<IUserCoupon | null> {
    return await this.userCouponModel.findById(id).lean().exec();
  }

  // 软删除
  async remove(id: string, user: string) {
    return await this.userCouponModel.findByIdAndUpdate(id, { isDelete: true, deleteTime: Date.now(), deleteBy: user });
  }

  // 用户红包统计
  async count(user: string) {
    const coupon = await this.userCouponModel.countDocuments({ type: 1, isUsed: false, user, expire: { $gte: Date.now() } })
    const redbage = await this.userCouponModel.countDocuments({ type: 2, isUsed: false, user, expire: { $gte: Date.now() } })
    return { coupon, redbage }
  }

  // 根据条件查找
  async findByCondition(condition: any) {
    return await this.userCouponModel.find(condition).lean().exec()
  }

  // 根据条件修改
  async updateById(id: string, condition: any) {
    return await this.userCouponModel.findByIdAndUpdate(id, condition).lean().exec()
  }

  // 根据条件修改
  async used(ids: string[]) {
    return await this.userCouponModel.updateMany({ _id: { $in: ids } }, { isUsed: true, useTime: Date.now() }).lean().exec()
  }
}