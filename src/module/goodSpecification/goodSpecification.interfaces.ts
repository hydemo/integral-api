import { Document } from 'mongoose';
import { ISpecification } from '../specification/specification.interfaces';

export interface IGoodSpecification extends Document {
	// 规格说明
	readonly value: string;
	// 指针
	readonly indicator: string;
	// 图片
	readonly pic: string;
	// 规格id
	readonly specification: ISpecification;
	// 商品id
	readonly good: string;
}
