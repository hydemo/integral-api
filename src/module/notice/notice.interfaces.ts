import { Document } from 'mongoose';

export interface INotice extends Document {
	// 姓名
	readonly name: string;
	// 手机号
	readonly phone: string;
	// 微信openId
	readonly openId: string;
	// 是否微信通知
	readonly isWeixinNotice: boolean;
	// 是否手机通知
	readonly isPhoneNotice: boolean;
}
