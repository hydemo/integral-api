import { Model } from 'mongoose'
import { Inject, Injectable } from '@nestjs/common'
import { ISpecification } from './specification.interfaces'
import { CreateSpecificationDTO } from './specification.dto'
import { ApiErrorCode } from '@common/enum/api-error-code.enum'
import { ApiException } from '@common/expection/api.exception'
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { PaginationUtil } from 'src/utils/pagination.util';

@Injectable()
export class SpecificationService {
  constructor(
    @Inject('SpecificationModelToken') private readonly specificationModel: Model<ISpecification>,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
  ) { }

  // 创建数据
  async create(specification: CreateSpecificationDTO, creator: string): Promise<ISpecification> {
    const existing = await this.specificationModel.findOne({ name: specification.name, isDelete: false })
    if (existing) {
      throw new ApiException('规格已存在', ApiErrorCode.EXIST, 406)
    }
    await this.specificationModel.updateMany({ sort: { $gte: specification.sort } }, { $inc: { sort: 1 } })
    return await this.specificationModel.create({ ...specification, creator })
  }

  // 列表
  async list(pagination: Pagination): Promise<IList<ISpecification>> {
    const condition = this.paginationUtil.genCondition(pagination, ['name'])
    const list = await this.specificationModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .sort({ sort: 1 })
      .populate({ path: 'creator', model: 'admin', select: '_id nickname' })
      .lean()
      .exec();
    const total = await this.specificationModel.countDocuments(condition);
    const max = await this.specificationModel.countDocuments({ isDelete: condition.isDelete ? true : false })

    return { list, total, max };
  }
  // 删除数据
  async findByIdAndRemove(id: string): Promise<boolean> {
    const existing = await this.specificationModel.findById(id)
    if (!existing) {
      throw new ApiException('规格不存在', ApiErrorCode.EXIST, 406)
    }
    await this.specificationModel.findByIdAndUpdate(id, { isDelete: true, deleteTime: Date.now() })
    await this.specificationModel.updateMany({ isDelete: false, sort: { $gte: existing.sort } }, { $inc: { sort: -1 } })

    return true
  }
  // 修改数据
  async findByIdAndUpdate(id, specification: CreateSpecificationDTO): Promise<boolean> {
    const existing = await this.specificationModel.findById(id)
    if (!existing) {
      throw new ApiException('规格不存在', ApiErrorCode.EXIST, 406)
    }
    if (specification.sort && existing.sort !== specification.sort) {
      await this.specificationModel.updateMany({ sort: { $gt: existing.sort } }, { $inc: { sort: -1 } })
      await this.specificationModel.updateMany({ sort: { $gte: specification.sort } }, { $inc: { sort: 1 } })

    }
    await this.specificationModel.findByIdAndUpdate(id, specification)
    return true
  }
  // 恢复
  async recoverById(id: string) {
    const existing = await this.specificationModel.findById(id)
    if (!existing) {
      throw new ApiException('规格不存在', ApiErrorCode.EXIST, 406)
    }
    await this.specificationModel.updateMany({ isDelete: false, sort: { $gte: existing.sort } }, { $inc: { sort: 1 } })
    await this.specificationModel.findByIdAndUpdate(id, { isDelete: false, $unset: { deleteTime: 1 } });
    return;
  }

  // 全部
  async all() {
    return await this.specificationModel.find({ isDelete: false });
  }
}