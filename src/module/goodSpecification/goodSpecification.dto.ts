import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
	IsString,
	IsNumber,
	IsEnum,
	IsPositive,
	IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGoodSpecificationDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '规格说明' })
	readonly value: string;
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '指针' })
	readonly indicator: string;
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '图片' })
	readonly pic: string;
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '图片' })
	readonly specification: string;
	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '商品id' })
	readonly good?: string;

	readonly _id?: string;
}
