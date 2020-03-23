import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAmbassadorRateDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '等级' })
	readonly level: number;

	@IsNumber()
	@IsEnum([1, 2, 3, 4, 5, 6])
	@Type(() => Number)
	@ApiModelProperty({
		description:
			'比重类型 1:购买用户比例 2:用户推广比例 3:商品推广比例 4:上架推广比例 5：平台服务费比例',
	})
	readonly type: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '比例' })
	readonly rate: number;
}
