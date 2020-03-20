import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const OrderSchema = new mongoose.Schema(
	{
		// 订单号
		orderSn: String,
		// 支付单号
		paySn: String,
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
				recommendUser: ObjectId,
			},
		],
		// 状态 0:待确认 1:待付款 2:待发货 3：待收货 4:待评价 5:完成 6:退款
		checkResult: { type: Number, default: 0 }, // 收货人
		consignee: String,
		// 手机号
		phone: String,
		// 国家
		country: String,
		// 省份
		province: String,
		// 市
		city: String,
		// 地区
		district: String,
		// 地址
		address: String,
		// 备注
		postscript: String,
		// 物流费用
		shippingFee: Number,
		// 订单总价
		orderPrice: Number,
		// 商品总价
		goodsPrice: Number,
		// 优惠券id
		couponId: ObjectId,
		// 优惠券面值
		couponPrice: Number,
		// 积分
		integration: Number,
		// 积分
		integrationAmount: Number,
		// 红包id
		redBagId: ObjectId,
		// 优惠券面值
		redBagPrice: Number,
		// 实际价格
		actualPrice: Number,
		// 添加时间
		addTime: Date,
		// 确认时间
		confirmTime: Date,
		// 支付时间
		payTime: Date,
		// 支付类型 1:微信，2:余额
		payType: { type: Number, enum: [1, 2] },
		// 发货时间
		sendTime: Date,
		// 收货时间
		receiveTime: Date,
		// 完成时间
		completeTime: Date,
		// 微信支付订单号
		transactionId: String,
		conmentTime: Date,
		// 折扣扣减
		discountMinus: Number,
		// 促销折扣
		promoteMinus: Number,
		// vip折扣
		vipMinus: Number,
		// 预售折扣
		preSaleMinus: Number,
		// 已评价商品
		commentGoods: [String],
		isDelete: { type: Boolean, default: false },
		deleteTime: Date,
		isRefund: { type: Boolean, default: false },
		shipType: { type: Number, default: 2, enum: [1, 2] },
		shop: { type: String },
	},
	{ collection: 'order', versionKey: false, timestamps: true },
);
