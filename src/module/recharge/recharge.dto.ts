import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRechargeDTO {
  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '金额' })
  readonly amount: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '添加数量' })
  readonly count: number;


  @IsMongoId()
  @Type(() => String)
  @ApiModelProperty({ description: '分发店铺' })
  readonly merchant: string;
}





