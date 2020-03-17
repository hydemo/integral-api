import { Document } from 'mongoose';

export interface IMerchant extends Document {

  // 创建人
  readonly creator: string;
  // 是否删除
  readonly isDelete: boolean;
  // 删除时间
  readonly deleteTime: Date;
  //  店名
  readonly name: string;
  // logo
  readonly logo: string;
  // 店长
  readonly owner: string;
  // 手机号
  readonly phone: string;
  // 地址
  readonly address: string;
  // 地图
  readonly addressPic: string[];
  // 类型
  readonly type: number;
}