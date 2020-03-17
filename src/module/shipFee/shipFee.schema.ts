import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const ShipFeeSchema = new mongoose.Schema(
  {
    // 省份
    province: { type: String },
    // 门槛
    limit: { type: Number },
    // 物流费
    fee: { type: Number },
    // 是否删除
    isDelete: { type: Boolean, default: false },
    // 删除时间
    deleteTime: { type: Date },
    // 删除人
    deleteBy: { type: ObjectId },
    // 创建人
    createBy: { type: ObjectId },
  },
  { collection: 'shipFee', versionKey: false, timestamps: true },
);