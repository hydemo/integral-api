import { Document } from 'mongoose';

export interface IUserRecord extends Document {
	// 日期
	readonly day: string;
	// 月份
	readonly month: string;
	// 年份
	readonly year: string;
	// 购买金额
	readonly buy: number;
	// 总购买额
	readonly buyTotal: number;
	// 购买商品数
	readonly count: number;
	// 总购买商品数
	readonly countTotal: number;
}
