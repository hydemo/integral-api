import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVipDTO {
  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '门槛' })
  readonly limit: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '折扣' })
  readonly promote: number;

}