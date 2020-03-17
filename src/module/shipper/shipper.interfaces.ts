import { Document } from 'mongoose';
import { boolean } from 'joi';

export interface IShipper extends Document {
  // 订单id
  readonly order: string;
  // 物流公司名称
  readonly shipperName: string;
  // 物流公司代码
  readonly shipperCode: string;
  // 快递单号
  readonly logisticCode: string;
  // 物流详情
  readonly traces: ITrace[],
  // 查询次数
  readonly requestCount: number;
  // 上次查询时间
  readonly requestTime: string;
  // 是否完成
  readonly isFinish: boolean;
}

export interface ITrace {
  readonly datetime: string;
  readonly content: string;
}
