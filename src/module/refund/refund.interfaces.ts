import { Document } from 'mongoose';
import { IUser } from '../user/user.interfaces';
import { IOrder } from '../order/order.interfaces';

export interface IRefund extends Document {
  // 用户
  readonly user: IUser;
  // 商品
  readonly products: IProduct[];
  // 状态 1:待审核 2:待发货 3:待退款 4:完成 5:已拒绝
  readonly checkResult: number;
  // 收货人
  readonly consignee: string;
  // 手机号
  readonly phone: string;
  // 国家
  readonly country: string;
  // 省份
  readonly province: string;
  // 市
  readonly city: string;
  // 地区
  readonly district: string;
  // 地址
  readonly address: string;
  // 备注
  readonly postscript: string;
  // 退款单号
  readonly refundSn: string;
  // 订单号
  readonly order: any;
  // 退款原因
  readonly reason: string;
  // 退款图片
  readonly images: string[];
  // 订单总价
  readonly refundPrice: number;
  // 添加时间
  readonly applicationTime: Date;
  // 确认时间
  readonly confirmTime: Date;
  // 支付时间
  readonly refundTime: Date;
  // 发货时间
  readonly sendTime: Date;
  // 拒绝时间
  readonly refuseTime: Date;
  // 微信支付订单号
  readonly refundId: string;
  readonly refundType: number;
}

export interface IProduct {
  readonly product: string;
  readonly count: number;
  readonly realPrice: number;
  readonly good: string;
  readonly promoteMinus: number;
}