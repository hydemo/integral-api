import { Document } from 'mongoose';

export interface IUserBalance extends Document {
	// 来源
	readonly sourceId: string;
	// 来源id 1:充值 2：提现 3：发红包 4:领红包 5:抽成
	readonly sourceType: number;
	// 内容
	readonly amount: number;
	// 用户
	readonly user: string;
	// 状态
	readonly checkResult: number;
}
