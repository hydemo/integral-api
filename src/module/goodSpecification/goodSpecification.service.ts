import { Model } from 'mongoose'
import { Inject, Injectable } from '@nestjs/common'
import { IGoodSpecification } from './goodSpecification.interfaces'
import { CreateGoodSpecificationDTO } from './goodSpecification.dto'

@Injectable()
export class GoodSpecificationService {
  constructor(
    @Inject('GoodSpecificationModelToken') private readonly goodSpecificationModel: Model<IGoodSpecification>,
  ) { }

  // 创建数据
  async create(goodSpecification: CreateGoodSpecificationDTO): Promise<IGoodSpecification> {
    return await this.goodSpecificationModel.create(goodSpecification)
  }
  // 修改数据
  async findByIdAndUpdate(id: string, goodSpecification: CreateGoodSpecificationDTO): Promise<IGoodSpecification | null> {
    return await this.goodSpecificationModel.findByIdAndUpdate(id, goodSpecification, { new: true })
  }

  // 修改数据
  async softDelete(condition: any): Promise<IGoodSpecification | null> {
    return await this.goodSpecificationModel.updateMany(condition, { isDelete: true, deleteTime: Date.now() })
  }

  // 全部数据
  async all(condition: any): Promise<IGoodSpecification[]> {
    return await this.goodSpecificationModel
      .find({ ...condition, isDelete: false })
      .populate({ path: 'specification', model: 'specification' })
      .lean()
      .exec()
  }
}