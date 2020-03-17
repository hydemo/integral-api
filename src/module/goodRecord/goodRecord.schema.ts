import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const GoodRecordSchema = new mongoose.Schema(
  {
    // 日期
    day: { type: String },
    // 月份
    month: { type: String },
    // 年份
    year: { type: String },
    // 销售金额
    sale: { type: Number },
    // 总销售额
    saleTotal: { type: Number },
    // 销售数
    count: { type: Number },
    // 总销售数
    countTotal: { type: Number },
    // 商品
    good: { type: ObjectId },
    // 是否最新
    newRecord: { type: Boolean, default: true },

  },
  { collection: 'goodRecord', versionKey: false, timestamps: true },
);