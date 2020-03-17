import { Document } from 'mongoose';

export interface IGoodRecord extends Document {
  // 日期
  readonly day: string;
  // 月份
  readonly month: string;
  // 年份
  readonly year: string;
  // 销售金额
  readonly sale: number;
  // 总销售额
  readonly saleTotal: number;
  // 销售数
  readonly count: number;
  // 总销售数
  readonly countTotal: number;
  // 商品
  readonly good: any;
}