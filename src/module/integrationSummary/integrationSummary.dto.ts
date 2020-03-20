import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIntegrationSummaryDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '承兑金额池' })
	readonly amount: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '积分池' })
	readonly integration: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '承兑金额当日累加' })
	readonly amountToday: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '当日累加' })
	readonly integrationToday: number;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '积分价格' })
	readonly integrationPrice: number;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '日期' })
	readonly date: string;
}

export class UpdateAmountDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '承兑金额池' })
	readonly amount: number;
}
