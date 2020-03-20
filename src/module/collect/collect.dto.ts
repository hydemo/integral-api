import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsMongoId, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCollectDTO {
	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '类型 1:商品 2:店铺' })
	readonly bondType: number;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: 'id' })
	readonly bondToObjectId: string;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '用户' })
	readonly user: string;
}

export class DeleteManyDTO {
	@IsArray()
	@IsMongoId({ each: true })
	@ApiModelProperty({ description: '收藏', type: [String] })
	readonly collects: string[];
}
