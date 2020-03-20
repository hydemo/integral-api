import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString, IsMobilePhone } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAddressDTO {
	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '收货人' })
	readonly consignee: string;

	@IsMobilePhone('zh-CN')
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '手机号' })
	readonly phone: string;

	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '国家' })
	readonly country: string;

	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '省份' })
	readonly province: string;

	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '市' })
	readonly city: string;

	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '地区' })
	readonly district: string;

	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '地址' })
	readonly address: string;
}
