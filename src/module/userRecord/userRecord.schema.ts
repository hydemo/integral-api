import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const UserRecordSchema = new mongoose.Schema(
	{
		// 日期
		day: { type: String },
		// 月份
		month: { type: String },
		// 年份
		year: { type: String },
		// 购买金额
		buy: { type: Number },
		// 总购买额
		buyTotal: { type: Number },
		// 购买商品数
		count: { type: Number },
		// 总购买商品数
		countTotal: { type: Number },
		// 用户
		user: { type: ObjectId },
		// 是否最新
		newRecord: { type: Boolean, default: true },
	},
	{ collection: 'userRecord', versionKey: false, timestamps: true },
);
