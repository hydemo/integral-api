import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const IntegrationSchema = new mongoose.Schema(
  {
    // 来源Id
    sourceId: { type: ObjectId },
    // 来源类型 1:线上支付 2:线下扫码支付 3：签到, 4:取消订单 5:分享商品
    sourceType: { type: Number, enum: [1, 2, 3, 4, 5], default: 1 },
    // 数量
    count: { type: Number },
    // 类型
    type: { type: String, enum: ['add', 'minus'] },
    // 用户
    user: { type: ObjectId },
  },
  { collection: 'integration', versionKey: false, timestamps: true },
);