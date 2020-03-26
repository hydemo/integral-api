import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWithdrawDTO {
	@IsNumber()
	@Min(100)
	@Max(5000)
	@Type(() => Number)
	@ApiModelProperty({ description: '提现金额' })
	readonly amount: number;
}
