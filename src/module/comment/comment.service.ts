import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { IComment } from './comment.interface';
import { CommentDTO, CreateCommentDTO, CreateCommentFeedbackDTO } from './comment.dto';
import { Pagination } from '@common/dto/pagination.dto';
import { IList } from '@common/interface/list.interface';
import { ApiException } from 'src/common/expection/api.exception';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';
import { PaginationUtil } from 'src/utils/pagination.util';

@Injectable()
export class CommentService {
  // 注入的UserModelToken要与users.providers.ts里面的key一致就可以
  constructor(
    @Inject('CommentModelToken') private readonly commentModel: Model<IComment>,
    readonly paginationUtil: PaginationUtil,
  ) { }
  // 资讯评论
  async createComment(comment: CreateCommentDTO, user: string, boundToObjectId: string, boundType: string) {
    const newComment: CommentDTO = {
      commentator: user,
      boundToObjectId,
      boundType,
      starCount: 0,
      images: comment.images,
      content: comment.content,
      score: comment.score,
      anonymous: comment.anonymous
    }
    return await this.commentModel.create(newComment);
  }

  // 获取评论对象下评论列表
  async findByBoundToObjectId(pagination: Pagination, boundToObjectId: string): Promise<IList<IComment>> {
    const condition = { boundToObjectId, isDelete: false }
    const comments: IComment[] = await this.commentModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .populate({ path: 'commentator', model: 'user', select: '_id avatar nickname' })
      .lean()
      .exec();
    const list = comments.map(comment => {
      if (comment.anonymous) {
        delete comment.commentator
      }
      return comment
    })
    const total = await this.commentModel.countDocuments(condition);
    return { list, total };
  }

  // 获取评论对象下评论列表
  async listByGood(pagination: Pagination): Promise<IList<IComment>> {
    const condition = await this.paginationUtil.genCondition(pagination, [])
    const list: IComment[] = await this.commentModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .populate({ path: 'commentator', model: 'user', select: '_id avatar nickname' })
      .lean()
      .exec();
    const total = await this.commentModel.countDocuments(condition);
    return { list, total };
  }

  // 获取评论对象下评论列表
  async listByUser(pagination: Pagination): Promise<IList<IComment>> {
    const condition = await this.paginationUtil.genCondition(pagination, [])
    const list: IComment[] = await this.commentModel
      .find(condition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .populate({ path: 'boundToObjectId', model: 'good' })
      .lean()
      .exec();
    const total = await this.commentModel.countDocuments(condition);
    return { list, total };
  }

  // 根据id删除评论
  async delete(id: string, user: string) {
    const comment = await this.commentModel.findById(id)
    if (!comment) {
      return
    }
    if (String(comment.commentator) !== String(user)) {
      throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403)
    }
    await this.commentModel.findByIdAndUpdate(id, { isDelete: true, deleteTime: Date.now() })
    return true
  }

  // 根据id删除评论
  async deleteByAdmin(id: string) {
    await this.commentModel.findByIdAndRemove(id)
    return true
  }

  async feedback(id: string, feedback: CreateCommentFeedbackDTO, user: string) {
    await this.commentModel.findByIdAndUpdate(id, feedback)
  }
}