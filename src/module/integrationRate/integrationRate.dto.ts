import { ApiModelProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIntegrationRateDTO {
	@IsNumber()
	@IsEnum([1, 2, 3, 4, 5, 6, 7])
	@Type(() => Number)
	@ApiModelProperty({
		description:
			'比重类型 1:购买用户比例 2:有分享用户推广比例 3:商品推广比例 4:上架推广比例 5：平台服务费比例 6:赠送服务费  7:有分享用户推广比例',
	})
	readonly type: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '比例' })
	readonly rate: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '会员比例' })
	readonly vipRate: number;
}
