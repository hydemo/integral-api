import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDTO {
	@IsArray()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '规格表' })
	readonly specifications: string[];

	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '指针' })
	readonly indicator: string;

	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '图片' })
	readonly pic: string;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '原价' })
	readonly realPrice: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '价格' })
	readonly discountPrice: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '价格' })
	readonly promotionPrice: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '价格' })
	readonly preSalePrice: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '价格' })
	readonly serviceFee: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '库存' })
	readonly stock: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '销量基数' })
	readonly sellVolumnToShow: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '库存预警' })
	readonly stockAlarm: number;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '商品id' })
	readonly good?: string;

	readonly _id?: string;
}

export class UpdateStockDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '库存' })
	readonly stock: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '库存预警线' })
	readonly stockAlarm: number;
}
