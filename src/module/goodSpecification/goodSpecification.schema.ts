import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const GoodSpecificationSchema = new mongoose.Schema(
  {
    // 规格说明
    value: String,
    // 指针
    indicator: String,
    // 图片
    pic: String,
    // 规格id
    specification: ObjectId,
    // 商品id
    good: String,
    // 是否删除
    isDelete: { type: Boolean, default: false },  // 是否删除
    // 删除时间
    deleteTime: Date
  },
  { collection: 'goodSpecification', versionKey: false, timestamps: true },
);
