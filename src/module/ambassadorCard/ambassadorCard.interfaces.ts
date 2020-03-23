import { Document } from 'mongoose';

export interface IAmbassadorCard extends Document {
	// 用户
	readonly useBy: string;
	// 等级
	readonly level: number;
	// 是否使用
	readonly isUsed: boolean;
	// 大使码
	readonly key: string;
	// 是否使用
}
