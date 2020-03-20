import { Document } from 'mongoose';

export interface ICoupon extends Document {
	// 分发类型 1:全部 2:新人专享 3:指定用户 4:vip专享
	readonly target: number;
	// 使用类型 1:通用  2:指定商品 3:指定分类
	readonly useType: number;
	// 类型 1:红包 2:优惠券
	readonly type: number;
	// 金额
	readonly amount: number;
	// 门槛
	readonly limit: number;
	// 商品
	readonly goods: string[];
	// 指定用户
	readonly users: string[];
	// 分类
	readonly categories: string[];
	// 金额
	readonly name: string;
	// 是否设置门槛
	readonly isLimit: boolean;
	// 数量
	readonly count: number;
	// 有效期
	readonly expire: Date;
	// 领取数
	readonly receiveCount: number;
}
