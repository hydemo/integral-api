import { ApiModelProperty } from '@nestjs/swagger';
import {
	IsMongoId,
	IsEnum,
	IsNumber,
	IsString,
	IsBoolean,
	IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIntegrationDTO {
	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '来源Id' })
	sourceId?: string;

	@IsNumber()
	@IsEnum([1, 2, 3, 4, 5, 6, 7, 8, 9])
	@Type(() => Number)
	@ApiModelProperty({
		description:
			'来源类型 1:线上支付  2：用户推广, 3:商品推广 4:上架推广 5 平台服务费 6:线下扫码支付,7:提现 8:后台修改 9:积分赠予',
	})
	readonly sourceType: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '数量' })
	readonly count: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '承兑金额' })
	readonly amount: number;

	@IsString()
	@IsEnum(['add', 'minus'])
	@Type(() => String)
	@ApiModelProperty({ description: '类型' })
	readonly type: string;

	@IsBoolean()
	@Type(() => Boolean)
	@ApiModelProperty({ description: '是否vip' })
	readonly isVip?: boolean;

	@IsInt()
	@Type(() => Number)
	@ApiModelProperty({ description: '推广大使等级' })
	readonly ambassadorLevel?: number;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '用户' })
	user?: string;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '商品id' })
	good?: string;

	// 关联商品数量
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '承兑金额' })
	goodCount?: number;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '购买人' })
	sourceUser?: string;
}

export class ExchangeDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '数量' })
	readonly count: number;
}
