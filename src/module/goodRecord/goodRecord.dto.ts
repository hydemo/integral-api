import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGoodRecordDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '日期' })
	readonly day: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '月份' })
	readonly month: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '年份' })
	readonly year: string;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '销售金额' })
	readonly sale: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '总销售额' })
	readonly saleTotal: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '销售数' })
	readonly count: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '总销售数' })
	readonly countTotal: number;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '用户' })
	readonly good: string;
}
