import { ApiModelProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsMongoId, IsString, IsBoolean, IsInt, Min, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCouponDTO {
  @IsNumber()
  @IsEnum([1, 2, 3, 4])
  @Type(() => Number)
  @ApiModelProperty({ description: '分发类型 1:全部 2:新人专享 3:指定用户 4:vip专享' })
  readonly target: number;

  @IsNumber()
  @IsEnum([1, 2, 3])
  @Type(() => Number)
  @ApiModelProperty({ description: '使用类型 1:通用  2:指定商品 3:指定分类' })
  readonly useType: number;

  @IsNumber()
  @IsEnum([1, 2])
  @Type(() => Number)
  @ApiModelProperty({ description: '类型 1:红包 2:优惠券' })
  readonly type: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '金额' })
  readonly amount: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '门槛' })
  readonly limit: number;

  @IsBoolean()
  @Type(() => Boolean)
  @ApiModelProperty({ description: '是否设置门槛' })
  readonly isLimit: boolean;

  @IsMongoId({ each: true })
  @Type(() => String)
  @ApiModelProperty({ description: '商品' })
  readonly goods: string[];

  @IsMongoId({ each: true })
  @Type(() => String)
  @ApiModelProperty({ description: '指定用户' })
  readonly users: string[];

  @IsMongoId({ each: true })
  @Type(() => String)
  @ApiModelProperty({ description: '分类' })
  readonly categories: string[];

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '名称' })
  readonly name: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiModelProperty({ description: '数量' })
  readonly count: number;

  @IsDate()
  @Type(() => Date)
  @ApiModelProperty({ description: '有效期' })
  readonly expire: Date;
}