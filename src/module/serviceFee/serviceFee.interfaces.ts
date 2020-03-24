import { Document } from 'mongoose';

export interface IServiceFee extends Document {
	// 服务费汇总
	readonly totalFee: number;
	// 服务费分发
	readonly minusFee: number;
	// 关联id
	readonly bondToObjectId: string;
	// 关联类型
	readonly bondType: number;
	// 创建时间
	createdAt: Date;
}
