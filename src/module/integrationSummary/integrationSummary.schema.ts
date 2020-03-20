import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const IntegrationSummarySchema = new mongoose.Schema(
	{
		// 承兑金额池
		amount: { type: Number },
		// 积分池
		integration: { type: Number },
		// 承兑金额当日累加
		amountToday: { type: Number },
		// 当日累加
		integrationToday: { type: Number },
		// 积分价格
		integrationPrice: { type: Number },
		// 日期
		date: { type: String },
	},
	{ collection: 'integrationSummary', versionKey: false, timestamps: true },
);
