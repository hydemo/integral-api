import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVipCardDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '添加数量' })
	readonly count: number;
}
