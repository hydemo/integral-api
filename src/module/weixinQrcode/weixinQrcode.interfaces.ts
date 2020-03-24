import { Document } from 'mongoose';

export interface IWeixinQrcode extends Document {
	// 用户
	readonly user: string;
	// 来源id
	readonly bondToObjectId: string;
	// 来源类型 1:商品
	readonly bondType: number;
	// 二维码地址
	readonly url: string;
	// 链接路径
	readonly page: string;
}
