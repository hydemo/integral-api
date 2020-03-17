import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { CreateCollectDTO } from './collect.dto';
import { ICollect } from './collect.interfaces';
import { ProductService } from '../product/product.service';

@Injectable()
export class CollectService {
  constructor(
    @Inject('CollectModelToken') private readonly collectModel: Model<ICollect>,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
    @Inject(ProductService) private readonly productService: ProductService,
  ) { }

  // 创建数据
  async create(createCollectDTO: CreateCollectDTO): Promise<ICollect> {
    const exist = await this.collectModel.findOne({ user: createCollectDTO.user, bondToObjectId: createCollectDTO.bondToObjectId, })
    if (exist) {
      return exist
    }
    return await this.collectModel.create(createCollectDTO)
  }

  // 分页查询数据
  async list(pagination: Pagination, user: string, type: number): Promise<IList<ICollect>> {
    let populate = { path: 'bondToObjectId', model: 'good' }
    if (type === 2) {
      populate = { path: 'bondToObjectId', model: 'merchant' }
    }
    const condition = this.paginationUtil.genCondition(pagination, []);
    condition.user = user
    condition.bondType = type
    const collects = await this.collectModel
      .find(condition)
      .limit(pagination.pageSize)
      .populate(populate)
      .skip((pagination.current - 1) * pagination.pageSize)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    let list = collects
    if (type === 1) {
      list = await Promise.all(collects.map(async collect => {
        collect.bondToObjectId.products = await this.productService.all({ good: collect.bondToObjectId._id })
        return collect
      }))
    }
    const total = await this.collectModel.countDocuments(condition);
    return { list, total };
  }

  // 根据条件查询
  async findOne(condition: any): Promise<ICollect | null> {
    return await this.collectModel.findOne(condition)
  }


  // 删除
  async remove(id: string, user: string) {
    const collect = await this.collectModel.findById(id)
    if (!collect) {
      return
    }
    if (String(collect.user) !== String(user)) {
      throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403)
    }
    return await this.collectModel.findByIdAndRemove(id);
  }

  // 清空收藏
  async clean(user: string): Promise<boolean> {
    await this.collectModel.remove({ user })
    return true
  }

  // 删除多个收藏
  async deleteMany(condition): Promise<boolean> {
    await this.collectModel.remove(condition)
    return true
  }

  // 软删除
  async removeByCondition(condition: any) {

    return await this.collectModel.remove(condition);
  }
}