import { Document } from 'mongoose';

export interface IVip extends Document {
  // 等级
  readonly level: number;
  // 门槛
  readonly limit: number;
  // 折扣
  readonly promote: number;
}