import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsPositive, IsBoolean, IsDate, IsArray, IsMongoId, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateGoodSpecificationDTO } from '../goodSpecification/goodSpecification.dto';
import { CreateProductDTO } from '../product/product.dto';

export class CreateGoodDTO {
  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '商品' })
  readonly name: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '商品货号' })
  readonly goodSn: string;

  @IsMongoId({ each: true })
  @IsArray()
  @Type(() => String)
  @ApiModelProperty({ description: '分类' })
  readonly category: string[];

  @IsString()
  @Type(() => String)
  @ApiModelPropertyOptional({ description: '关键字' })
  readonly keyword?: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiModelProperty({ description: '排序' })
  readonly sort: number;

  @IsString()
  @Type(() => String)
  @ApiModelPropertyOptional({ description: '摘要' })
  readonly brief: string;

  @IsString()
  @Type(() => String)
  @ApiModelPropertyOptional({ description: '描述' })
  readonly description: string;

  @IsBoolean()
  @Type(() => Boolean)
  @ApiModelPropertyOptional({ description: '是否上架' })
  readonly onSale: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  @ApiModelPropertyOptional({ description: '是否热销' })
  readonly isHot: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  @ApiModelPropertyOptional({ description: '是否支持vip折扣' })
  readonly canVipPromote: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  @ApiModelPropertyOptional({ description: '是否限时销售' })
  readonly isLimit: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  @ApiModelPropertyOptional({ description: '是否新人专享栏目' })
  readonly isNewUser: boolean;

  @IsDate()
  @Type(() => Date)
  @ApiModelPropertyOptional({ description: '限时开始时间' })
  readonly limitStartTime: Date;

  @IsDate()
  @Type(() => Date)
  @ApiModelPropertyOptional({ description: '限时结束时间' })
  readonly limitEndTime: Date;

  @IsNumber()
  @Type(() => Number)
  @IsEnum([1, 2])
  @ApiModelPropertyOptional({ description: '促销方式' })
  readonly promotionType: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelPropertyOptional({ description: '促销值' })
  readonly promotionValue: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelPropertyOptional({ description: '折扣' })
  readonly discount: number;

  @IsBoolean()
  @Type(() => Boolean)
  @ApiModelPropertyOptional({ description: '是否预售' })
  readonly preSale: boolean;

  @IsDate()
  @Type(() => Date)
  @ApiModelPropertyOptional({ description: '预售截止时间' })
  readonly preSaleEndTime: Date;

  @IsDate()
  @Type(() => Date)
  @ApiModelPropertyOptional({ description: '预售预计发货时间' })
  readonly preSaleSendTime: Date;

  @IsNumber()
  @Type(() => Number)
  @IsEnum([1, 2])
  @ApiModelPropertyOptional({ description: '预售促销方式' })
  readonly preSaleType: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelPropertyOptional({ description: '预售促销值' })
  readonly preSaleValue: number;

  @IsArray()
  @ApiModelPropertyOptional({ description: '图片列表' })
  readonly images: string[];

  @IsArray()
  @ApiModelPropertyOptional({ description: '描述图片列表' })
  readonly descriptionPics: string[];

  @IsArray()
  @ApiModelPropertyOptional({ description: '规格' })
  readonly goodSpecifications: CreateGoodSpecificationDTO[];

  @IsArray()
  @ApiModelPropertyOptional({ description: '规格定价' })
  readonly products: CreateProductDTO[];
}


export class UpdateProductDTO {

  @IsArray()
  @ApiModelPropertyOptional({ description: '规格' })
  readonly goodSpecifications: CreateGoodSpecificationDTO[];

  @IsArray()
  @ApiModelPropertyOptional({ description: '规格定价' })
  readonly products: CreateProductDTO[];
}

export class BulkDTO {

  @IsArray()
  @IsMongoId({ each: true })
  @ApiModelPropertyOptional({ description: 'id' })
  readonly ids: string[];

  @IsEnum([1, 2, 3, 4])
  @ApiModelPropertyOptional({ description: '操作类型' })
  readonly type: number;
}






