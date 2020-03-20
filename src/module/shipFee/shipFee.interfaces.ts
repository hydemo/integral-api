import { Document } from 'mongoose';

export interface IShipFee extends Document {
	// 省份
	readonly province: string;
	// 门槛
	readonly limit: number;
	// 物流费
	readonly fee: number;
}
