import { Document } from 'mongoose';

export interface IWithdraw extends Document {
  // 用户
  readonly user: string;
  // 提现金额
  readonly amount: number;
  // 审核状态
  readonly checkResult: number;
  // 审核人
  readonly reviewer: string;
}