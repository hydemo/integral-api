import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const CategoryRecordSchema = new mongoose.Schema(
	{
		// 日期
		day: { type: String },
		// 月份
		month: { type: String },
		// 年份
		year: { type: String },
		// 销售金额
		sale: { type: Number },
		// 总销售额
		saleTotal: { type: Number },
		// 销售数
		count: { type: Number },
		// 分类级别
		layer: { type: Number },
		// 总销售数
		countTotal: { type: Number },
		// 商品
		category: { type: ObjectId },
		// 是否最新
		newRecord: { type: Boolean, default: true },
	},
	{ collection: 'categoryRecord', versionKey: false, timestamps: true },
);
