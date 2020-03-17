import { Document } from 'mongoose';

export interface ICategory extends Document {
  // 分类名
  readonly name: string;
  // 创建人
  readonly creator: string;
  // 类别
  readonly showOnTop: boolean;
  // 关键字
  readonly keyword: string;
  // logo
  readonly logo: string;
  // 是否删除
  readonly isDelete: boolean;
  // 删除时间
  readonly deleteTime: Date;
  // 排序
  readonly sort: number;
  // 分类级别
  readonly layer: number;
  // 父级分类
  readonly parent: string;
}