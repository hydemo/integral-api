import { Document } from 'mongoose';

export interface ILog extends Document {
	// 用户
	readonly user: string;
	// 类型
	readonly type: string;
	// 接口
	readonly interface: string;
	// 模块
	readonly module: string;
	// 描述
	readonly description: string;
}
