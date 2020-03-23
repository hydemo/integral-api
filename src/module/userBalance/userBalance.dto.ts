import { ApiModelProperty } from '@nestjs/swagger';
import {
	IsPositive,
	IsNumber,
	IsMongoId,
	IsString,
	IsEnum,
	Min,
} from 'class-validator';
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
	@IsEnum([1, 2, 3])
	@Type(() => Number)
	@ApiModelProperty({
		description: '来源类型: 1:退货退款积分返还 2:积分兑换 3:提现 ',
	})
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
