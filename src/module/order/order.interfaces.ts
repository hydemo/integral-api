import { Document } from 'mongoose';
import { IUser } from '../user/user.interfaces';
import { IProduct } from '../product/product.interfaces';
import { IGood } from '../good/good.interfaces';

export interface IOrder extends Document {
	// 用户
	readonly user: any;
	// 商品
	readonly products: IOrderProduct[];
	// 状态 0:待确认 1:待付款 2:待发货 3：待收货 4:待评价 5:完成 6:退款
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
	// 物流费用
	readonly shippingFee: number;
	// 订单总价
	readonly orderPrice: number;
	// 商品总价
	readonly goodsPrice: number;
	// 实际价格
	readonly actualPrice: number;
	// 添加时间
	readonly addTime: Date;
	// 确认时间
	readonly confirmTime: Date;
	// 支付时间
	readonly payTime: Date;
	// 支付类型 1:微信 2:余额
	readonly payType: number;
	// 已评价商品
	readonly commentGoods: string[];
	// 订单号
	readonly orderSn: string;
	// 支付号
	readonly paySn: string;
	readonly isRefund: boolean;
	// 积分
	readonly integration: number;
	// 积分抵扣金额
	readonly integrationAmount: number;
	noShip: boolean;
}

export interface IOrderProduct {
	readonly product: any;
	readonly count: number;
	readonly realPrice: number;
	readonly good: any;
	readonly promoteMinus: number;
	readonly preSaleMinus: number;
	refundCount: number;
	readonly discountMinus: number;
	readonly vipMinus: number;
	// 推荐人
	readonly recommendUser: string;
	noShip: boolean;
}
