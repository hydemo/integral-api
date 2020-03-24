import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
	IsNumber,
	IsMongoId,
	IsArray,
	IsString,
	IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderByProductDTO {
	@IsMongoId()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '商品id' })
	readonly product: string;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '数量' })
	readonly count: number;

	@IsMongoId()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '推荐人' })
	readonly recommendUser: string;
}
export class CreateCartDTO {
	@IsMongoId()
	@IsArray()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '购物车id' })
	readonly cart: string;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '数量' })
	readonly count: number;
}

export class UpdatePriceDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '数量' })
	readonly actualPrice: number;
}

export class OrderMessageDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '商家留言' })
	readonly message: string;
}

export class CreateOrderByCartDTO {
	@IsArray()
	@ApiModelPropertyOptional({
		description: '购物车列表',
		type: [CreateCartDTO],
	})
	readonly carts: CreateCartDTO[];
}

export class ConfirmOrderDTO {
	@IsMongoId()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '地址id' })
	readonly address?: string;

	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '备注' })
	readonly postscript: string;

	@IsMongoId()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '红包' })
	readonly redBag: string;

	@IsMongoId()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '优惠券' })
	readonly coupon: string;

	@IsNumber()
	@Type(() => Number)
	@ApiModelPropertyOptional({ description: '积分' })
	readonly integration: number;

	@IsNumber()
	@IsEnum([1, 2])
	@Type(() => Number)
	@ApiModelProperty({ description: '配送方式 1:物流 2:自提' })
	readonly shipType: number;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '自提点' })
	readonly shop: string;
}

export class OrderDTO {
	// 订单号
	readonly orderSn: string;
	// 支付号
	readonly paySn: string;
	// 用户
	readonly user: string;
	// 商品
	readonly products: OrderProductDTO[];
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
	// 促销折扣
	readonly promoteMinus: number;
	// 预售折扣
	readonly preSaleMinus: number;
	// 预售折扣
	readonly discountMinus: number;
	// vip折扣
	readonly vipMinus: number;
	// 实际价格
	readonly actualPrice: number;
	// 添加时间
	readonly addTime: number;
	// // 确认时间
	readonly confirmTime?: Date;
	// // 支付时间
	readonly payTime?: Date;
	@IsNumber()
	@IsEnum([1, 2])
	@Type(() => Number)
	@ApiModelProperty({ description: '配送方式 1:物流 2:自提' })
	readonly shipType: number;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '自提点' })
	readonly shop?: string;
}

export class OrderProductDTO {
	readonly product: string;
	readonly count: number;
	readonly realPrice: number;
	readonly good: string;
	readonly promoteMinus: number;
	readonly preSaleMinus: number;
	readonly refundCount: number;
	readonly discountMinus: number;
	readonly vipMinus: number;
	recommendUser?: string;
}
