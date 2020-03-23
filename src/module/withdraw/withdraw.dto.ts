import { ApiModelProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWithdrawDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '提现金额' })
	readonly amount: number;
}

export class RejectWithdrawDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '提现金额' })
	readonly amount: number;
}
