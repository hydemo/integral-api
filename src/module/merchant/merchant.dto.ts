import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMerchantDTO {
  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '店名' })
  readonly name: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: 'logo' })
  readonly logo: string;

  @IsNumber()
  @IsEnum([1, 2, 3])
  @Type(() => Number)
  @ApiModelProperty({ description: '类型 1:门店 2:加盟商 3:入驻商' })
  readonly type: number;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '店长' })
  readonly owner: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '联系方式' })
  readonly phone: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '地址' })
  readonly address: string;

  @IsString({ each: true })
  @Type(() => String)
  @ApiModelProperty({ description: '图片' })
  readonly addressPic: string[];

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '经度' })
  readonly longitude: number;

  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '纬度' })
  readonly latitude: number;
}

export class PayDTO {
  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '支付金额' })
  readonly amount: number;
}



