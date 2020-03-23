import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAmbassadorCardDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '等级' })
	readonly level: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '数量' })
	readonly count: number;
}

export class AmbassadorCardDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '充值卡号' })
	readonly key: string;
}
