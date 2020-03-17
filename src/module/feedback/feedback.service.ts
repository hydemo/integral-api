import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { IFeedback } from './feedback.interface';
import { FeedbackDTO, CreateFeedbackDTO } from './feedback.dto';
import { Pagination } from '@common/dto/pagination.dto';
import { IList } from '@common/interface/list.interface';
import { PaginationUtil } from 'src/utils/pagination.util';

@Injectable()
export class FeedbackService {
  // 注入的UserModelToken要与users.providers.ts里面的key一致就可以
  constructor(
    @Inject('FeedbackModelToken') private readonly feedbackModel: Model<IFeedback>,
    @Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
  ) { }
  // 资讯评论
  async createFeedback(feedback: CreateFeedbackDTO, user: string) {
    const newFeedback: FeedbackDTO = {
      user,
      images: feedback.images,
      content: feedback.content,
    }
    return await this.feedbackModel.create(newFeedback);
  }

  // 列表
  async list(pagination: Pagination): Promise<IList<IFeedback>> {
    const condition = this.paginationUtil.genCondition(pagination, ['content'], 'createdAt')
    const list = await this.feedbackModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .sort({ createdAt: - 1 })
      .populate({ path: 'user', model: 'user', select: 'avatar nickname _id' })
      .lean()
      .exec();
    const total = await this.feedbackModel.countDocuments(condition);
    return { list, total };
  }


  // 删除数据
  async findByIdAndRemove(id: string): Promise<boolean> {
    await this.feedbackModel.findByIdAndUpdate(id, { isDelete: true, deleteTime: Date.now() })
    return true
  }
  // 恢复
  async recoverById(id: string) {
    await this.feedbackModel.findByIdAndUpdate(id, { isDelete: false, $unset: { deleteTime: 1 } });
    return;
  }

}