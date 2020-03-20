import { Document } from 'mongoose';

export interface IIntegrationSummary extends Document {
	// 承兑金额池
	readonly amount: number;
	// 积分池
	readonly integration: number;
	// 承兑金额当日累加
	readonly amountToday: number;
	// 当日累加
	readonly integrationToday: number;
	// 积分价格
	readonly integrationPrice: number;
	// 日期
	readonly date: string;
}
