import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
	IsString,
	IsEmail,
	IsNumber,
	IsPositive,
	IsMobilePhone,
	Validate,
	IsNotEmpty,
	IsDefined,
	MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CardNumberValidator, BankCardNoValidator } from './user.validator';

export class UserDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '用户名' })
	readonly username?: string;

	@IsEmail({}, { message: '邮箱格式不正确' })
	@Type(() => String)
	@ApiModelProperty({ description: '邮箱' })
	readonly email?: string;

	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '密码' })
	password?: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '注册时间' })
	readonly registerTime?: Date;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '注册ip' })
	readonly registerIp?: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '手机号' })
	readonly phone?: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '微信id' })
	readonly weixinOpenid?: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '头像' })
	readonly avatar: string;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '性别' })
	readonly gender: number;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '昵称' })
	readonly nickname: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '最后登录时间' })
	readonly lastLoginTime?: Date;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '最后登录ip' })
	readonly lastLoginIp?: string;

	accessToken?: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '是否禁用' })
	readonly isBlock?: boolean;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '禁用时间' })
	readonly blockTime?: Date;

	isFollowing?: boolean;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '单位' })
	readonly company?: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '职业' })
	readonly occupation?: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '个性签名' })
	readonly signature?: string;

	@IsNumber()
	@IsPositive()
	@Type(() => Number)
	@ApiModelProperty({ description: '用户余额' })
	readonly balance?: number;
}

export class CreatUserDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '用户名' })
	readonly username?: string;

	@IsEmail({}, { message: '邮箱格式不正确' })
	@Type(() => String)
	@ApiModelProperty({ description: '邮箱' })
	readonly email?: string;

	@IsString()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '密码' })
	password?: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '手机号' })
	readonly phone?: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '头像' })
	readonly avatar: string;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '性别' })
	readonly gender: number;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '昵称' })
	readonly nickname: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '单位' })
	readonly company?: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '职业' })
	readonly occupation?: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '个性签名' })
	readonly signature?: string;
}

export class VipCardDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '充值卡号' })
	readonly key: string;
}

export class GiveIntegrationDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '受赠方地址' })
	readonly address: string;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '赠送数' })
	readonly count: number;
}

export class VerifyDTO {
	@IsString()
	@MinLength(2, { message: '姓名长度有误' })
	@IsDefined()
	@Type(() => String)
	@ApiModelProperty({ description: '姓名' })
	readonly realName: string;

	@Validate(CardNumberValidator)
	@IsDefined()
	@Type(() => String)
	@ApiModelProperty({ description: '身份证' })
	readonly cardNumber: string;

	@Validate(BankCardNoValidator)
	@IsDefined()
	@Type(() => String)
	@ApiModelProperty({ description: '银行卡' })
	readonly bankNumber: string;

	@IsDefined()
	@Type(() => String)
	@ApiModelProperty({ description: '银行' })
	readonly bank: string;

	@IsString()
	@IsDefined()
	@Type(() => String)
	@ApiModelProperty({ description: '开户行' })
	readonly bankAddress: string;

	@IsMobilePhone('zh-CN')
	@IsDefined()
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '手机号' })
	readonly phone: string;
}

export class UpdateVerifyDTO {
	@IsString()
	@MinLength(2, { message: '姓名长度有误' })
	@Type(() => String)
	@ApiModelProperty({ description: '姓名' })
	readonly realName: string;

	@Validate(CardNumberValidator)
	@Type(() => String)
	@ApiModelProperty({ description: '身份证' })
	readonly cardNumber: string;

	@Validate(BankCardNoValidator)
	@Type(() => String)
	@ApiModelProperty({ description: '银行卡' })
	readonly bankNumber: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '银行' })
	readonly bank: string;

	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '开户行' })
	readonly bankAddress: string;

	@IsMobilePhone('zh-CN')
	@Type(() => String)
	@ApiModelPropertyOptional({ description: '手机号' })
	readonly phone: string;
}
