import { Document } from 'mongoose';
import { ICategory } from '../category/cagegory.interfaces';

export interface ICategoryRecord extends Document {
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
  // 分类级别
  readonly layer: number;
  // 总销售数
  readonly countTotal: number;
  readonly category: any;
}