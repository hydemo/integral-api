import { Model } from 'mongoose'
import { Inject, Injectable } from '@nestjs/common'
import { ICarousel } from './carousel.interfaces'
import { CreateCarouselDTO } from './carousel.dto'
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { PaginationUtil } from 'src/utils/pagination.util';
import { ApiErrorCode } from '@common/enum/api-error-code.enum'
import { ApiException } from '@common/expection/api.exception'

@Injectable()
export class CarouselService {
  constructor(
    @Inject('CarouselModelToken') private readonly carouselModel: Model<ICarousel>,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
  ) { }

  // 创建数据
  async create(carousel: CreateCarouselDTO, creator: string): Promise<any> {
    await this.carouselModel.updateMany({ sort: { $gte: carousel.sort } }, { $inc: { sort: 1 } })
    return await this.carouselModel.create({ ...carousel, creator })
  }

  // 列表
  async list(pagination: Pagination): Promise<IList<ICarousel>> {
    const condition = this.paginationUtil.genCondition(pagination, [])
    const list = await this.carouselModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .populate({ path: 'creator', model: 'admin', select: '_id nickname' })
      .populate({ path: 'bondToObjectId', model: 'good', select: '_id images name brief' })
      .lean()
      .exec();
    const total = await this.carouselModel.countDocuments(condition);
    const max = await this.carouselModel.countDocuments({ isDelete: false });
    return { list, total, max };
  }
  // 删除数据
  async findByIdAndRemove(id: string): Promise<boolean> {
    const existing = await this.carouselModel.findById(id)
    if (!existing) {
      throw new ApiException('轮播图不存在', ApiErrorCode.NO_EXIST, 406)
    }
    await this.carouselModel.findByIdAndUpdate(id, { isDelete: true, deleteTime: Date.now() })
    await this.carouselModel.updateMany({ isDelete: false, sort: { $gte: existing.sort } }, { $inc: { sort: -1 } })
    return true
  }
  // 修改数据
  async findByIdAndUpdate(id, carousel: CreateCarouselDTO): Promise<boolean> {
    const existing = await this.carouselModel.findById(id)
    if (!existing) {
      throw new ApiException('规格不存在', ApiErrorCode.EXIST, 406)
    }
    if (carousel.sort && existing.sort !== carousel.sort) {
      await this.carouselModel.updateMany({ sort: { $gt: existing.sort } }, { $inc: { sort: -1 } })
      await this.carouselModel.updateMany({ sort: { $gte: carousel.sort } }, { $inc: { sort: 1 } })
    }
    await this.carouselModel.findByIdAndUpdate(id, carousel)
    return true
  }
  // 恢复
  async recoverById(id: string) {
    const existing = await this.carouselModel.findById(id)
    if (!existing) {
      throw new ApiException('轮播图不存在', ApiErrorCode.EXIST, 406)
    }
    await this.carouselModel.updateMany({ isDelete: false, sort: { $gte: existing.sort } }, { $inc: { sort: 1 } })
    await this.carouselModel.findByIdAndUpdate(id, { isDelete: false, $unset: { deleteTime: 1 } });
    return;
  }
  // 全部数据
  async all() {
    const top = await this.carouselModel.find({ type: 1, isDelete: false }).lean().exec()
    const middle = await this.carouselModel.find({ type: 2, isDelete: false }).lean().exec()
    return { top, middle }
  }

  // 全部数据
  async listByUser() {
    const top = await this.carouselModel.find({ type: 1, isDelete: false }).sort({ sort: 1 }).lean().exec()
    const middle = await this.carouselModel.find({ type: 2, isDelete: false }).sort({ sort: 1 }).lean().exec()
    return { top, middle }
  }
}