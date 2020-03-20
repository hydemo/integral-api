import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
	IsString,
	IsNumber,
	IsEnum,
	IsPositive,
	IsMongoId,
	IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarouselDTO {
	@IsNumber()
	@IsEnum([1, 2, 3, 4])
	@Type(() => Number)
	@ApiModelProperty({
		description: '类型 1:首页顶部 2:首页中部 3:本地服务 4:在线商城',
	})
	readonly type: number;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '图片' })
	readonly imgUrl: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '图片链接' })
	readonly imgLink: string;

	@IsInt()
	@Type(() => Number)
	@ApiModelProperty({ description: '图片排序' })
	readonly sort: number;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '绑定商品' })
	readonly bondToObjectId: string;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '绑定类型' })
	readonly bondType: number;
}
