import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
	IsString,
	IsEnum,
	IsEmail,
	IsNumber,
	IsOptional,
	IsArray,
	IsMongoId,
	IsDate,
	IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CommentDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '评论内容' })
	readonly content: string;

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '点赞数' })
	readonly starCount: number;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '评论人id' })
	readonly commentator: string;

	@IsString()
	@IsEnum(['good', 'comment'])
	@Type(() => String)
	@ApiModelProperty({ description: '评论类型' })
	readonly boundType: string;

	@IsMongoId()
	@Type(() => String)
	@ApiModelProperty({ description: '评论对象id' })
	readonly boundToObjectId: string;

	@IsString()
	@IsArray()
	@Type(() => String)
	@ApiModelProperty({ description: '评论图片' })
	readonly images: string[];

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '评分' })
	readonly score: number;

	@IsBoolean()
	@Type(() => Boolean)
	@ApiModelProperty({ description: '是否匿名' })
	readonly anonymous: boolean;
}

export class CreateCommentDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '评论内容' })
	readonly content: string;

	@IsString({ each: true })
	@IsArray()
	@ApiModelProperty({ description: '评论图片', type: [String] })
	readonly images: string[];

	@IsNumber()
	@Type(() => Number)
	@ApiModelProperty({ description: '评分' })
	readonly score: number;

	@IsBoolean()
	@Type(() => Boolean)
	@ApiModelProperty({ description: '是否匿名' })
	readonly anonymous: boolean;
}

export class CreateCommentFeedbackDTO {
	@IsString()
	@Type(() => String)
	@ApiModelProperty({ description: '后台反馈' })
	readonly feedback: string;
}
