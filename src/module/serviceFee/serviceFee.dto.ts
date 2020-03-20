import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceFeeDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '服务费汇总' })
	readonly totalFee: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '服务费分发' })
	readonly minusFee: number;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '关联id' })
	readonly bondToObjectId?: string;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '关联类型 1:订单 2:积分赠送' })
	readonly bondType: number;
}
