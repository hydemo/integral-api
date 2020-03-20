import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const RefundSchema = new mongoose.Schema(
	{
		// 退款单号
		refundSn: String,
		// 订单id
		order: ObjectId,
		// 订单号
		orderSn: String,
		// 用户
		user: ObjectId,
		// 商品
		products: [
			{
				product: ObjectId,
				count: Number,
				realPrice: Number,
				good: ObjectId,
				promoteMinus: Number,
				refundCount: Number,
				preSaleMinus: Number,
				discountMinus: Number,
				vipMinus: Number,
			},
		],
		// 状态 1:待审核 2:待发货 3:待退款 4:完成 5:已拒绝
		checkResult: { type: Number, default: 0 },
		// 收货人
		consignee: String,
		// 手机号
		phone: String,
		// 国7
		country: String,
		// 省份
		province: String,
		// 市
		city: String,
		// 地区
		district: String,
		// 地址
		address: String,
		// 退款原因
		reason: String,
		// 退款图片
		images: [String],
		// 物流费用
		shippingFee: Number,
		// 订单总价
		refundPrice: Number,
		// 添加时间
		applicationTime: Date,
		// 确认时间
		confirmTime: Date,
		// 支付时间
		refundTime: Date,
		// 发货时间
		sendTime: Date,
		// 拒绝时间
		refuseTime: Date,
		// 拒绝原因
		refuseReason: String,
		// 优惠券id
		couponId: ObjectId,
		// 优惠券面值
		couponPrice: Number,
		// 积分
		integration: Number,
		// 红包id
		redBagId: ObjectId,
		// 优惠券面值
		redBagPrice: Number,
		// 微信支付订单号
		refundId: String,
		isDelete: { type: Boolean, default: false },
		deleteTime: Date,
		// 退款方式
		refundType: { type: Number, eunm: [1, 2], default: 1 },
	},
	{ collection: 'refund', versionKey: false, timestamps: true },
);
