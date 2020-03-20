import { Document } from 'mongoose';

export interface ICarousel extends Document {
	// 创建人
	readonly creator: string;
	// 是否删除
	readonly isDelete: boolean;
	// 删除时间
	readonly deleteTime: Date;
	//  类型 1: 首页顶部 2: 首页中部 3: 本地服务 4: 在线商城
	readonly type: number;
	// 图片
	readonly imgUrl: string;
	// 图片链接
	readonly imgLink: string;
	// 绑定类型 1:商品
	readonly bondType: string;
	// 绑定id
	readonly bondToObjectId: string;
	readonly sort: number;
}
