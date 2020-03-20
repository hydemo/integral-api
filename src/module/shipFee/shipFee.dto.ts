import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShipFeeDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '省份' })
	readonly province: string;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '门槛' })
	readonly limit: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '物流费' })
	readonly fee: number;
}
