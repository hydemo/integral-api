import { Document } from 'mongoose';

export interface IProduct extends Document {
  // 规格表
  readonly specifications: string[];
  // 指针
  readonly indicator: string;
  // 图片
  readonly pic: string;
  // 库存
  readonly stock: number;
  // 商品id
  readonly good: string;
  //库存预警
  readonly stockAlarm: number;
  // 原价
  readonly realPrice: number;
  // 折扣价
  readonly discountPrice: number;
  // 促销价
  readonly promotionPrice: number;
  // 预售价
  readonly preSalePrice: number;
}