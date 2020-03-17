import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const UserBalanceSchema = new mongoose.Schema(
  {
    // 来源
    sourceId: ObjectId,
    // 来源类型 1:充值 2:线下扫码支付 3:线上支付 4:后台修改 
    sourceType: { type: Number, enum: [1, 2, 3, 4] },
    // 内容
    amount: Number,
    // 收包人
    user: ObjectId,
    // 类型
    type: { type: String, enum: ['add', 'minus'] }
  },
  { collection: 'userBalance', versionKey: false, timestamps: true },
);
