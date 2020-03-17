import { Document } from 'mongoose';

export interface IIntegration extends Document {
  // 来源Id
  readonly sourceId: string;
  // 来源类型 1:线上支付 2:线下扫码支付 3:签到
  readonly sourceType: number;
  // 数量
  readonly count: number;
  // 类型
  readonly type: string;
  // 用户
  readonly user: string;
}