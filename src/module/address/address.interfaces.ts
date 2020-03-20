import { Document } from 'mongoose';

export interface IAddress extends Document {
	// 用户
	readonly user: string;
	// 收货人
	readonly consignee: string;
	// 手机号
	readonly phone: string;
	// 国家
	readonly country: string;
	// 省份
	readonly province: string;
	// 市
	readonly city: string;
	// 地区
	readonly district: string;
	// 地址
	readonly address: string;
}
