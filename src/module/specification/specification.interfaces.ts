import { Document } from 'mongoose';

export interface ISpecification extends Document {
  // 规格名
  readonly name: string;
  // 创建人
  readonly creator: string;
  // 是否删除
  readonly isDelete: boolean;
  // 删除时间
  readonly deleteTime: Date;
  // 排序
  readonly sort: number;
}