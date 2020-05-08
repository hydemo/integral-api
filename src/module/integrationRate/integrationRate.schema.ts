import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const IntegrationRateSchema = new mongoose.Schema(
	{
		// 比重类型 1:购买用户比例 2:有分享用户推广比例 3:商品推广比例 4:上架推广比例 5：平台服务费比例 6:赠送服务费 7:无分享用户推广
		type: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7] },
		// 比例
		rate: { type: Number },
		// 比例
		vipRate: { type: Number },
		// 创建人
		createBy: { type: ObjectId },
	},
	{ collection: 'integrationRate', versionKey: false, timestamps: true },
);
