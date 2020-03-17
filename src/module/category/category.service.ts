import { Model } from 'mongoose'
import { Inject, Injectable } from '@nestjs/common'
import { ICategory } from './cagegory.interfaces'
import { CreateCategoryDTO } from './category.dto'
import { ApiErrorCode } from '@common/enum/api-error-code.enum'
import { ApiException } from '@common/expection/api.exception'
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { PaginationUtil } from 'src/utils/pagination.util';
import { RedisService } from 'nestjs-redis'

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CategoryModelToken') private readonly categoryModel: Model<ICategory>,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
    private readonly redis: RedisService,
  ) { }

  // 统计数量
  async countByCondition(condition: any) {
    return await this.categoryModel.countDocuments(condition)
  }

  // 创建数据
  async create(category: CreateCategoryDTO, creator: string): Promise<ICategory> {
    const condition: any = { name: category.name, isDelete: false, layer: category.layer }
    if (category.layer === 2) {
      condition.parent = category.parent
    }
    const existing = await this.categoryModel.findOne(condition)
    if (existing) {
      throw new ApiException('分类已存在', ApiErrorCode.EXIST, 406)
    }
    if (category.layer === 1) {
      await this.categoryModel.updateMany({ sort: { $gte: category.sort }, layer: 1 }, { $inc: { sort: 1 } })
    } else {
      await this.categoryModel.updateMany({ sort: { $gte: category.sort }, layer: 2, parent: category.parent }, { $inc: { sort: 1 } })
    }
    const client = this.redis.getClient()
    await client.hincrby('dataRecord', 'categories', 1)
    return await this.categoryModel.create({ ...category, creator })
  }

  // 列表
  async list(pagination: Pagination): Promise<IList<ICategory>> {
    const condition = this.paginationUtil.genCondition(pagination, ['name', 'keyword'])
    const list = await this.categoryModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .sort({ sort: 1 })
      .populate({ path: 'creator', model: 'admin', select: '_id nickname' })
      .lean()
      .exec();
    const total = await this.categoryModel.countDocuments(condition);
    const maxCondition: any = { isDelete: condition.isDelete ? true : false }
    const filterParse = JSON.parse(pagination.filter)
    if (filterParse.parent) {
      maxCondition.parent = filterParse.parent
    }
    const max = await this.categoryModel.countDocuments(maxCondition)
    return { list, total, max };
  }
  // 删除数据
  async findByIdAndRemove(id: string): Promise<boolean> {
    const category = await this.categoryModel.findById(id).lean().exec()
    if (!category) {
      throw new ApiException('分类有误', ApiErrorCode.INPUT_ERROR, 406)
    }
    const extendCondition: any = { layer: category.layer }
    if (category.parent) {
      extendCondition.parent = category.parent
    }
    await this.categoryModel.findByIdAndUpdate(id, { isDelete: true, deleteTime: Date.now() })
    await this.categoryModel.updateMany({ isDelete: false, sort: { $gte: category.sort }, ...extendCondition }, { $inc: { sort: -1 } })

    return true
  }
  // 修改数据
  async findByIdAndUpdate(id, category: CreateCategoryDTO): Promise<boolean> {
    const categoryExist = await this.categoryModel.findById(id).lean().exec()
    if (!categoryExist) {
      throw new ApiException('分类有误', ApiErrorCode.INPUT_ERROR, 406)
    }
    if (category.sort && categoryExist.sort !== category.sort) {
      const extendCondition: any = { layer: category.layer }
      if (category.parent) {
        extendCondition.parent = category.parent
      }
      await this.categoryModel.updateMany({ sort: { $gt: categoryExist.sort }, ...extendCondition }, { $inc: { sort: -1 } })
      await this.categoryModel.updateMany({ sort: { $gte: category.sort }, ...extendCondition }, { $inc: { sort: 1 } })
    }
    await this.categoryModel.findByIdAndUpdate(id, category)
    return true
  }
  // 恢复
  async recoverById(id: string) {
    const category = await this.categoryModel.findById(id).lean().exec()
    if (!category) {
      throw new ApiException('分类有误', ApiErrorCode.INPUT_ERROR, 406)
    }
    const extendCondition: any = { layer: category.layer }
    if (category.parent) {
      extendCondition.parent = category.parent
    }
    await this.categoryModel.updateMany({ isDelete: false, sort: { $gte: category.sort }, ...extendCondition }, { $inc: { sort: 1 } })
    await this.categoryModel.findByIdAndUpdate(id, { isDelete: false, $unset: { deleteTime: 1 } });
    return;
  }

  // 恢复
  async all() {
    // return await this.categoryModel.find({ isDelete: false }).sort({ sort: 1 })
    const categories = await this.categoryModel.find({ isDelete: false, layer: 1 }).sort({ sort: 1 })
    const data = await Promise.all(categories.map(async categoty => {
      const children = await this.categoryModel.find({ isDelete: false, parent: categoty._id, layer: 2 }).sort({ sort: 1 })
      if (!children.length) {
        return null
      }
      return {
        value: categoty._id,
        label: categoty.name,
        isLeaf: false,
        children: children.map(child => ({
          value: child._id,
          label: child.name,
          isLeaf: true,
        }))
      }
    }))
    return data.filter(v => v)
  }

  async firstLayer() {
    return await this.categoryModel.find({ isDelete: false, layer: 1 }).sort({ sort: 1 })
  }

  async secondLayer(parent: string) {
    return await this.categoryModel.find({ isDelete: false, layer: 2, parent }).sort({ sort: 1 })
  }

  // 恢复
  async search(keyword): Promise<string[]> {
    const search: any = [];
    search.push({ name: new RegExp(keyword, 'i') });
    search.push({ keyword: new RegExp(keyword, 'i') });
    const condition = { $or: search, isDelete: false }
    const categories = await this.categoryModel.find(condition);
    return categories.map(v => v._id)
  }

  // 恢复
  async top() {
    return await this.categoryModel.find({ showOnTop: true, isDelete: false, layer: 1 }).sort({ sort: 1 });
  }
}