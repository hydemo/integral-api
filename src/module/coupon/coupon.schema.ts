import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const CouponSchema = new mongoose.Schema(
	{
		// 分发类型 1:全部 2:新人专享 3:指定用户 4:vip专享
		target: { type: Number, enum: [1, 2, 3, 4] },
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
		// 数量
		count: { type: Number },
		// 有效期
		expire: { type: Date },
		// 指定用户
		users: { type: [ObjectId] },
		// 分类
		categories: { type: [ObjectId] },
		// 是否删除
		isDelete: { type: Boolean, default: false },
		// 删除时间
		deleteTime: { type: Date },
		// 删除人
		deleteBy: { type: ObjectId },
		// 创建人
		createBy: { type: ObjectId },
		// 领取数
		receiveCount: { type: Number, default: 0 },
	},
	{ collection: 'coupon', versionKey: false, timestamps: true },
);
