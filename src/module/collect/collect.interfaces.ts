import { Document } from 'mongoose';

export interface ICollect extends Document {
	// 类型
	readonly bondType: number;
	// id
	readonly bondToObjectId: string;
	// 用户
	readonly user: string;
}
