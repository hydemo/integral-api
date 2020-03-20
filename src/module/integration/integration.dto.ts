import { ApiModelProperty } from '@nestjs/swagger';
import { IsMongoId, IsEnum, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIntegrationDTO {
	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '来源Id' })
	sourceId?: string;

	@IsNumber()
	@IsEnum([1, 2, 3, 4, 5, 6, 7, 8, 9, 19])
	@Type(() => Number)
	@ApiModelProperty({
		description:
			'来源类型 1:线上支付  2：用户推广, 3:商品推广 4:上架推广 5 平台服务费 6:线下扫码支付,7:提现 8:后台修改 9:取消订单',
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

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '用户' })
	user?: string;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '商品id' })
	good?: string;
}
