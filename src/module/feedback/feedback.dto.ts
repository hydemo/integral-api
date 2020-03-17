import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsEmail, IsNumber, IsOptional, IsArray, IsMongoId, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class FeedbackDTO {
  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '反馈内容' })
  readonly content: string;

  @IsMongoId()
  @Type(() => String)
  @ApiModelProperty({ description: '反馈人id' })
  readonly user: string;

  @IsString()
  @IsArray()
  @Type(() => String)
  @ApiModelProperty({ description: '反馈图片' })
  readonly images: string[];


}

export class CreateFeedbackDTO {
  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '反馈内容' })
  readonly content: string;

  @IsArray()
  @ApiModelProperty({ description: '反馈图片', type: [String] })
  readonly images: string[];
}