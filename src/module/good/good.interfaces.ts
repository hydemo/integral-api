import { Document } from 'mongoose';
import { IGoodSpecification } from '../goodSpecification/goodSpecification.interfaces';
import { IProduct } from '../product/product.interfaces';

export interface IGood extends Document {
	// 商品货号
	readonly goodSn: string;
	// 分类名
	readonly name: string;
	// 创建人
	readonly creator: string;
	// 分类
	readonly category: string[];
	// 关键字
	readonly keyword: string;
	// 是否删除
	readonly isDelete: boolean;
	// 删除时间
	readonly deleteTime: Date;
	// 排序
	readonly sort: number;
	// 摘要
	readonly brief: string;
	// 描述
	readonly description: string;
	// 是否上架
	readonly onSale: boolean;
	// 销量
	readonly sellVolumn: number;
	// 促销方式 1:扣减金额 2折扣
	readonly discount: number;
	// 是否热销
	readonly isHot: boolean;
	// 是否限时销售
	readonly isLimit: boolean;
	// 限时开始时间
	readonly limitStartTime: Date;
	// 限时结束时间
	readonly limitEndTime: Date;
	// 促销方式 1:扣减金额 2折扣
	readonly promotionType: number;
	// 促销方式 1:扣减金额 2折扣
	readonly promotionValue: number;
	// 是否预售
	readonly preSale: boolean;
	// 预售方式 1:扣减金额 2折扣
	readonly preSaleType: number;
	// 预售值 1:扣减金额 2折扣
	readonly preSaleValue: number;
	// 预售截止日期
	readonly preSaleEndTime: Date;
	// 预售预计发货日期
	readonly preSaleSendTime: Date;
	// 图片列表
	readonly images: string[];
	// 图片列表
	readonly descriptionPics: string[];
	// 上架推广人
	readonly recommendUser: string;
	readonly goodSpecifications: IGoodSpecification[];
	products: IProduct[];
	collect: boolean;
	noShip: boolean;
}
