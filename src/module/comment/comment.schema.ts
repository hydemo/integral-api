import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const CommentSchema = new mongoose.Schema(
  {
    // 评论类型
    boundType: { type: String, enum: ['good', 'comment'] },
    // 评论对象id
    boundToObjectId: ObjectId,
    // 资讯内容
    content: String,
    // 点赞数
    starCount: { type: Number, default: 0 },
    // 评论人
    commentator: ObjectId,
    // 来源
    deleteTime: Date,
    // 图片
    images: [String],
    // 评分
    score: { type: Number },
    // 是否匿名
    anonymous: { type: Boolean, default: false },
    // 是否删除
    isDelete: { type: Boolean, default: false },
    // 后台反馈
    feedback: { type: String },
    // 反馈人
    feedbackBy: ObjectId
  },
  { collection: 'comment', versionKey: false, timestamps: true },
);
