import { ApiModelProperty } from '@nestjs/swagger';
import { IsPositive, IsNumber, IsMongoId, IsString, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserBalanceDTO {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiModelProperty({ description: '金额' })
  readonly amount: number;

  @IsMongoId()
  @Type(() => String)
  @ApiModelProperty({ description: '来源id' })
  readonly sourceId?: string;

  @IsNumber()
  @IsEnum([1, 2])
  @Type(() => Number)
  @ApiModelProperty({ description: '来源类型 1:充值 2:线下扫码支付 3:线上支付 4:后台修改 ' })
  readonly sourceType: number;

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

export class UserBalanceDTO {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiModelProperty({ description: '余额' })
  readonly balance: number;
}





