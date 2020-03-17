import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const MerchantBillSchema = new mongoose.Schema(
  {
    // 店铺
    merchant: ObjectId,
    // 用户
    user: ObjectId,
    // 金额
    amount: Number,
    // 支付单号
    orderSn: String
  },
  { collection: 'merchantBill', versionKey: false, timestamps: true },
);
