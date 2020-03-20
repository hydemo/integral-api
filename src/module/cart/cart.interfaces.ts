import { Document } from 'mongoose';

export interface ICart extends Document {
	// 用户
	readonly user: string;
	// 商品
	readonly good: string;
	// 商品规格
	readonly product: string;
	// 商品名
	readonly goodName: string;
	// // 市场价
	// readonly retailPrice: number;
	// 真实价格
	// readonly realPrice: number;
	// 数量
	readonly count: number;
	// 图片
	readonly imgUrl: string;
}
