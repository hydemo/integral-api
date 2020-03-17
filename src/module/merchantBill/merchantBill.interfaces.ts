import { Document } from 'mongoose';

export interface IMerchantBill extends Document {
  // 店铺
  readonly merchant: string;
  // 用户
  readonly user: string;
  // 金额
  readonly amount: number;
  // 支付单号
  readonly orderSn: string;
}