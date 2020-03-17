import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { CreateShipFeeDTO } from './shipFee.dto';
import { IShipFee } from './shipFee.interfaces';

@Injectable()
export class ShipFeeService {
  constructor(
    @Inject('ShipFeeModelToken') private readonly shipFeeModel: Model<IShipFee>,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
  ) { }

  // 创建数据
  async create(createShipFeeDTO: CreateShipFeeDTO, user: string): Promise<IShipFee> {
    return await this.shipFeeModel.create({ ...createShipFeeDTO, createBy: user })
  }

  // 分页查询数据
  async list(pagination: Pagination): Promise<IList<IShipFee>> {
    const condition = this.paginationUtil.genCondition(pagination, ['province']);
    const list = await this.shipFeeModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    const total = await this.shipFeeModel.countDocuments(condition);
    return { list, total };
  }

  // 修改数据
  async update(id: string, createShipFeeDTO: CreateShipFeeDTO): Promise<IShipFee | null> {
    return await this.shipFeeModel.findByIdAndUpdate(id, createShipFeeDTO)
  }

  // 详情
  async detail(id: string): Promise<IShipFee> {
    const shipFee = await this.shipFeeModel.findById(id).lean().exec();
    if (!shipFee) {
      throw new ApiException('数据不存在', ApiErrorCode.NO_EXIST, 404)
    }
    return shipFee
  }

  // 软删除
  async remove(id: string, user: string) {
    return await this.shipFeeModel.findByIdAndUpdate(id, { isDelete: true, deleteTime: Date.now(), deleteBy: user });
  }

  // 恢复
  async recover(id: string) {
    return await this.shipFeeModel.findByIdAndUpdate(id, { isDelete: false, $unset: { deleteTime: 1, deleteBy: 1 } });
  }

  // 恢复
  async getShipFee(province: string, fee: number) {
    const shipFee: IShipFee | null = await this.shipFeeModel.findOne({ province })
    if (!shipFee) {
      return fee < 29 ? 12 : 0
    }
    if (shipFee.limit > fee) {
      return shipFee.fee
    }
    return fee < 29 ? 12 : 0
  }
}