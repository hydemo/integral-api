import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const UserCouponSchema = new mongoose.Schema(
  {
    // 使用类型 1:通用  2:指定商品 3:指定分类
    useType: { type: Number, enum: [1, 2, 3] },
    // 类型 1:红包 2:优惠券
    type: { type: Number, enum: [1, 2] },
    // 金额
    amount: { type: Number },
    // 金额
    name: { type: String },
    // 是否设置门槛
    isLimit: { type: Boolean, default: false },
    // 门槛
    limit: { type: Number },
    // 商品
    goods: { type: [ObjectId] },
    // 分类
    categories: { type: [ObjectId] },
    // 用户
    user: { type: ObjectId },
    // 红包id
    coupon: { type: ObjectId },
    // 是否使用
    isUsed: { type: Boolean, default: false },
    // 使用时间
    useTime: { type: Date },
    // 有效期
    expire: { type: Date },
    // 使用对象 1:订单 2:线下支付
    useToObjectType: { type: Number, enum: [1] },
    // 使用对象id
    useToObjectId: { type: ObjectId }
  },
  { collection: 'userCoupon', versionKey: false, timestamps: true },
);