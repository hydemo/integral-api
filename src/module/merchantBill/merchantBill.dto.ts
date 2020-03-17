import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMerchantBillDTO {
  @IsNumber()
  @Type(() => Number)
  @ApiModelProperty({ description: '支付金额' })
  readonly amount: number;

  @IsMongoId()
  @Type(() => String)
  @ApiModelProperty({ description: '店铺' })
  readonly merchant: string;

  @IsMongoId()
  @Type(() => String)
  @ApiModelProperty({ description: '店铺' })
  readonly orderSn: string;
}


