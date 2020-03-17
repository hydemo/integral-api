import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsMongoId, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCartDTO {
  @IsMongoId()
  @Type(() => String)
  @ApiModelPropertyOptional({ description: '商品规格' })
  readonly product: string;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '数量' })
  readonly count: number;
}


export class DeleteManyDTO {
  @IsArray()
  @IsMongoId({ each: true })
  @ApiModelPropertyOptional({ description: '购物车id', type: [String] })
  readonly carts: string[];
}

export class CountDTO {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiModelPropertyOptional({ description: '购物车数量' })
  readonly count: number;
}



