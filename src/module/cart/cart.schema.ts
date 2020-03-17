import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const CartSchema = new mongoose.Schema(
  {
    // 用户
    user: ObjectId,
    // 商品
    good: ObjectId,
    // 商品规格
    product: ObjectId,
    // 商品名
    goodName: String,
    // // 市场价
    // retailPrice: Number,
    // 真实价格
    // realPrice: Number,
    // 数量
    count: Number,
    // 图片
    imgUrl: String,
  },
  { collection: 'cart', versionKey: false, timestamps: true },
);
