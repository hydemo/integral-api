import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const FeedbackSchema = new mongoose.Schema(
  {
    // 反馈内容
    content: String,
    // 反馈人
    user: ObjectId,
    // 来源
    deleteTime: Date,
    // 图片
    images: [String],
    // 是否删除
    isDelete: { type: Boolean, default: false },
  },
  { collection: 'feedback', versionKey: false, timestamps: true },
);
