import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShipperDTO {
  // 物流公司名称
  @IsString()
  @Type(() => String)
  @ApiModelPropertyOptional({ description: '地址' })
  readonly shipperName: string;
  // 物流公司代码
  @IsString()
  @Type(() => String)
  @ApiModelPropertyOptional({ description: '地址' })
  readonly shipperCode: string;
  // 快递单号
  @IsString()
  @Type(() => String)
  @ApiModelPropertyOptional({ description: '地址' })
  readonly logisticCode: string;

  // 配送方式
  @IsNumber()
  @IsEnum([1, 2])
  @Type(() => Number)
  @ApiModelPropertyOptional({ description: '配送方式' })
  readonly shipType: number;

  // 取件地址
  @IsString()
  @Type(() => String)
  @ApiModelPropertyOptional({ description: '取件地址' })
  readonly shipAddress: string;
}



