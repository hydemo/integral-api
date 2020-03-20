import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSpecificationDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '规格名' })
	readonly name: string;

	@IsNumber()
	@Min(1)
	@Type(() => Number)
	@ApiModelProperty({ description: '排序' })
	readonly sort: number;
}
