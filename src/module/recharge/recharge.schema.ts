import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const RechargeSchema = new mongoose.Schema(
  {
    // 金额
    amount: Number,
    // 创建人
    creator: ObjectId,
    // 是否使用
    isUsed: { type: Boolean, default: false },
    // 使用人
    useBy: ObjectId,
    // 分发店铺
    merchant: ObjectId,
    // 链接
    key: { type: String },
    // 是否删除
    isDelete: { type: Boolean, default: false },
    // 删除时间
    deleteTime: Date,
    // 使用时间
    useTime: Date,
  },
  { collection: 'recharge', versionKey: false, timestamps: true },
);
