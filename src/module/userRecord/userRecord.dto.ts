import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserRecordDTO {
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
  @ApiModelProperty({ description: '购买金额' })
  readonly buy: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '总购买额' })
  readonly buyTotal: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '购买商品数' })
  readonly count: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '总购买商品数' })
  readonly countTotal: number;

  @IsMongoId()
  @Type(() => String)
  @ApiModelProperty({ description: '用户' })
  readonly user: string;
}