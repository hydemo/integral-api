import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsMongoId, IsArray, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDTO {
	@IsMongoId()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '商品productId' })
	readonly product: string;

	@IsNumber()
	@Min(0)
	@Type(() => Number)
	@ApiModelPropertyOptional({ description: '商品数量' })
	readonly count: number;
}

export class CreateRefundDTO {
	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '退款原因' })
	readonly reason: string;

	@IsArray()
	@ApiModelPropertyOptional({ description: '商品', type: [ProductDTO] })
	readonly products: ProductDTO[];

	@IsArray()
	@ApiModelPropertyOptional({ description: '图片' })
	readonly images?: string[];
}

export class UpdatePriceDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '数量' })
	readonly refundPrice: number;
}

export class RefuseDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '数量' })
	readonly refuseReason: string;
}

export class RefundDTO {
	// 用户
	readonly user: string;
	// 订单号
	readonly orderSn: string;
	// 商品
	readonly products: RefundProductDTO[];
	// 状态 1:待审核 2:待发货 3:待收货 4:待退款 5:已退款 6:已拒绝
	readonly checkResult: number;
	// 收货人
	readonly consignee?: string;
	// 手机号
	readonly phone?: string;
	// 国家
	readonly country?: string;
	// 省份
	readonly province?: string;
	// 市
	readonly city?: string;
	// 地区
	readonly district?: string;
	// 地址
	readonly address?: string;
	// 备注
	readonly postscript?: string;
	// 退款单号
	readonly refundSn: string;
	// 订单号
	readonly order: string;
	// 退款原因
	readonly reason: string;
	// 退款图片
	readonly images: string[];
	// 订单总价
	readonly refundPrice: number;
	// 添加时间
	readonly applicationTime: any;
	// 确认时间
	readonly confirmTime?: any;
	// 支付时间
	readonly refundTime?: any;
	// 发货时间
	readonly sendTime?: any;
	// 拒绝时间
	readonly refuseTime?: any;
	// 微信支付订单号
	readonly transactionId?: string;
	readonly refundType?: number;
	// 物流费用
	readonly shippingFee: number;
	// 积分
	readonly integration: number;
}

export class RefundProductDTO {
	readonly product: string;
	readonly count: number;
	readonly realPrice: number;
	readonly good: string;
	readonly promoteMinus: number;
	readonly preSaleMinus: number;
	readonly refundCount: number;
	readonly discountMinus: number;
	readonly vipMinus: number;
}
