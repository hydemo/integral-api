import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const DataRecordSchema = new mongoose.Schema(
	{
		// 日期
		day: { type: String },
		// 月份
		month: { type: String },
		// 年份
		year: { type: String },
		// 销售额
		sale: { type: Number },
		// 总销售额
		saleTotal: { type: Number },
		// 访问量
		viewCount: { type: Number },
		// 总访问量
		viewCountTotal: { type: Number },
		// 用户
		users: { type: Number },
		// 购买用户
		buyUsers: { type: Number },
		// 总购买
		buyUsersTotal: { type: Number },
		// 分类
		categories: { type: Number },
		// 商品
		goods: { type: Number },
		// 订单
		orders: { type: Number },
	},
	{ collection: 'dataRecord', versionKey: false, timestamps: true },
);
