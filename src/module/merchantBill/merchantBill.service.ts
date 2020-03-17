import { Model } from 'mongoose'
import { Inject, Injectable } from '@nestjs/common'
import { IMerchantBill } from './merchantBill.interfaces'
import { CreateMerchantBillDTO } from './merchantBill.dto'
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { PaginationUtil } from 'src/utils/pagination.util';

@Injectable()
export class MerchantBillService {
  constructor(
    @Inject('MerchantBillModelToken') private readonly merchantBillModel: Model<IMerchantBill>,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
  ) { }

  // 创建数据
  async create(merchant: CreateMerchantBillDTO, user: string): Promise<IMerchantBill> {
    return await this.merchantBillModel.create({ ...merchant, user })
  }

  // 列表
  async list(pagination: Pagination, id: string): Promise<IList<IMerchantBill>> {
    const condition = this.paginationUtil.genCondition(pagination, ['amount'], 'createdAt')
    condition.merchant = id
    const list = await this.merchantBillModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .populate({ path: 'user', model: 'user', select: '_id nickname avatar' })
      .lean()
      .exec();
    const total = await this.merchantBillModel.countDocuments(condition);
    return { list, total };
  }
}