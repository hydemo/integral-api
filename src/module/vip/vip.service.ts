import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { CreateVipDTO } from './vip.dto';
import { IVip } from './vip.interfaces';

@Injectable()
export class VipService {
  constructor(
    @Inject('VipModelToken') private readonly vipModel: Model<IVip>,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
  ) { }

  // 创建数据
  async create(createVipDTO: CreateVipDTO, user: string): Promise<IVip> {
    const max = await this.vipModel.countDocuments({ isDelete: false })
    return await this.vipModel.create({ ...createVipDTO, createBy: user, level: max + 2 })
  }

  // 分页查询数据
  async list(pagination: Pagination): Promise<IList<IVip>> {
    const condition = this.paginationUtil.genCondition(pagination, []);
    const list = await this.vipModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    const max = await this.vipModel.countDocuments({ isDelete: false })
    const total = await this.vipModel.countDocuments(condition);
    return { list, total, max };
  }

  // 修改数据
  async update(id: string, createVipDTO: CreateVipDTO): Promise<IVip | null> {
    return await this.vipModel.findByIdAndUpdate(id, createVipDTO)
  }

  // 详情
  async detail(id: string): Promise<IVip> {
    const vip = await this.vipModel.findById(id).lean().exec();
    if (!vip) {
      throw new ApiException('数据不存在', ApiErrorCode.NO_EXIST, 404)
    }
    return vip
  }

  // 详情
  async findOne(condition: any): Promise<IVip> {
    return await this.vipModel.findOne(condition).lean().exec()
  }

  // 根据积分查询
  async findByIntegration(integration: number): Promise<IVip | null> {
    const vips: IVip[] = await this.vipModel.find({ limit: { $lte: integration } }).sort({ level: -1 }).lean().exec()
    if (vips.length) {
      return vips[0]
    }
    return null
  }

  // 查询最高折扣
  async findMaxPromote(): Promise<number | null> {
    const vips: IVip[] = await this.vipModel.find({}).sort({ promote: -1 }).lean().exec()
    if (vips.length) {
      return vips[0].promote
    }
    return 100
  }


  // 软删除
  async remove(id: string) {
    const vip = await this.vipModel.findById(id)
    if (!vip) {
      return
    }
    await this.vipModel.updateMany({ isDelete: false, level: { $gte: vip.level } }, { $inc: { level: -1 } })
    return await this.vipModel.findByIdAndRemove(id);
  }
}