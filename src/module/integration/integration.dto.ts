import { ApiModelProperty } from '@nestjs/swagger';
import { IsMongoId, IsEnum, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIntegrationDTO {
  @IsMongoId()
  @Type(() => String)
  @ApiModelProperty({ description: '来源Id' })
  readonly sourceId: string;

  @IsNumber()
  @IsEnum([1, 2, 3, 4, 5])
  @Type(() => Number)
  @ApiModelProperty({ description: '来源类型 1:线上支付 2:线下扫码支付 3:签到' })
  readonly sourceType: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '数量' })
  readonly count: number;

  @IsString()
  @IsEnum(['add', 'minus'])
  @Type(() => String)
  @ApiModelProperty({ description: '类型' })
  readonly type: string;

  @IsMongoId()
  @Type(() => String)
  @ApiModelProperty({ description: '用户' })
  readonly user: string;

}