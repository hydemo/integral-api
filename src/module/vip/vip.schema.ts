import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const VipSchema = new mongoose.Schema(
  {
    // 等级
    level: { type: Number },
    // 门槛
    limit: { type: Number },
    // 折扣
    promote: { type: Number },
    // 是否删除
    isDelete: { type: Boolean, default: false },
    // 删除时间
    deleteTime: { type: Date },
    // 删除人
    deleteBy: { type: ObjectId },
    // 创建人
    createBy: { type: ObjectId },
  },
  { collection: 'vip', versionKey: false, timestamps: true },
);