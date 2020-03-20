import { Document } from 'mongoose';

export interface IVipCard extends Document {
	// 创建人
	readonly creator: string;
	// 是否删除
	readonly isDelete: boolean;
	// 删除时间
	readonly deleteTime: Date;
	// 金额
	readonly amount: number;
	// 是否使用
	readonly isUsed: boolean;
	// 使用人
	readonly useBy: string;
	// 链接
	readonly key: string;
	// 使用时间
	readonly userTime: Date;
}
