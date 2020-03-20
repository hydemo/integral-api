import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
	IsString,
	IsNumber,
	IsEnum,
	IsPositive,
	IsBoolean,
	Min,
	IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '分类名' })
	readonly name: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: 'logo' })
	readonly logo: string;

	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '关键字' })
	readonly keyword?: string;

	@IsBoolean()
	@Type(() => Boolean)
	@ApiModelProperty({ description: '是否首页展示' })
	readonly showOnTop: number;

	@IsNumber()
	@Min(1)
	@Type(() => Number)
	@ApiModelProperty({ description: '排序' })
	readonly sort: number;

	@IsNumber()
	@IsEnum([1, 2])
	@Type(() => Number)
	@ApiModelProperty({ description: '分类级别' })
	readonly layer: number;

	@IsMongoId()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '父级分类' })
	readonly parent?: string;
}
