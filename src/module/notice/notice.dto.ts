import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsMobilePhone } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNoticeDTO {
  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '姓名' })
  readonly name: string;

  @IsMobilePhone('zh-CN')
  @Type(() => String)
  @ApiModelProperty({ description: '手机号' })
  readonly phone: string;
}

export class OAuthDTO {
  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '微信code' })
  readonly code: string;

  @IsMobilePhone('zh-CN')
  @Type(() => String)
  @ApiModelProperty({ description: '手机号' })
  readonly phone: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '验证码' })
  readonly phoneCode: string;
}