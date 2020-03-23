import { Document } from 'mongoose';

export interface IIntegrationRate extends Document {
	// 比重类型 1:购买用户比例 2:用户推广比例 3:商品推广比例 4:上架推广比例 5：平台服务费比例
	readonly type: number;
	// 比例
	readonly rate: number;
	// 会员比例
	readonly vipRate: number;
}
