import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const IntegrationSchema = new mongoose.Schema(
	{
		// 来源Id
		sourceId: { type: ObjectId },
		// 来源类型 1:线上支付  2：用户推广, 3:商品推广 4:上架推广 5 平台服务费 6:线下扫码支付,7:提现 8:后台修改 9:取消订单 10:积分赠送
		sourceType: {
			type: Number,
			enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			default: 1,
		},
		// 数量
		count: { type: Number },
		// 类型
		type: { type: String, enum: ['add', 'minus'] },
		// 用户
		user: { type: ObjectId },
		// 承兑金额
		amount: { type: Number },
		// 关联商品
		good: { type: ObjectId },
	},
	{ collection: 'integration', versionKey: false, timestamps: true },
);
