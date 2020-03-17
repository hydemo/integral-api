import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const ShipperSchema = new mongoose.Schema(
  {
    // 订单id
    order: ObjectId,
    // 物流公司名称
    shipperName: String,
    // 物流公司代码
    shipperCode: String,
    // 快递单号
    logisticCode: String,
    // 是否完成
    isFinish: { type: Boolean, default: false },
    // 物流详情
    traces: [{ datetime: String, content: String }],
    // 查询次数
    requestCount: { type: Number, default: 0 },
    // 上次查询时间
    requestTime: Date,
  },
  { collection: 'shipper', versionKey: false, timestamps: true },
);
