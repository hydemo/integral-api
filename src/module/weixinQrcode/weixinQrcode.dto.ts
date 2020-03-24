import { ApiModelProperty } from '@nestjs/swagger';
import { IsMongoId, IsEnum, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWeixinQrcodeDTO {
	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '用户' })
	readonly user: string;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '来源id' })
	readonly bondToObjectId: string;

	@IsNumber()
	@IsEnum([1])
	@Type(() => Number)
	@ApiModelProperty({ description: '来源类型 1:商品' })
	readonly bondType: number;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '二维码地址' })
	readonly url?: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '链接路径' })
	readonly page: string;
}
