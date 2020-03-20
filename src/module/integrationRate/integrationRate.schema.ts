import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const IntegrationRateSchema = new mongoose.Schema(
	{
		// 比重类型 1:购买用户比例 2:用户推广比例 3:商品推广比例 4:上架推广比例 5：平台服务费比例 6:赠送服务费
		type: { type: Number, enum: [1, 2, 3, 4, 5, 6] },
		// 比例
		rate: { type: Number },
		// 创建人
		createBy: { type: ObjectId },
	},
	{ collection: 'integrationRate', versionKey: false, timestamps: true },
);
