import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDataRecordDTO {
  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '日期' })
  readonly day: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '月份' })
  readonly month: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '年份' })
  readonly year: string;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '销售额' })
  readonly sale: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '总销售额' })
  readonly saleTotal: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '访问量' })
  readonly viewCount: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '总访问量' })
  readonly viewCountTotal: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '用户' })
  readonly users: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '购买用户' })
  readonly buyUsers: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '总购买用户数' })
  readonly buyUsersTotal: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '分类' })
  readonly categories: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '商品' })
  readonly goods: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '订单' })
  readonly orders: number;

}