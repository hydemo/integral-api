import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
export class LoginDTO {
  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: 'rawdata' })
  readonly rawData: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: 'rawdata' })
  readonly errMsg: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '签名' })
  readonly signature: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '加密数据' })
  readonly encryptedData: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '初始向量' })
  readonly iv: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '授权码' })
  readonly code: string;

  @IsMongoId()
  @Type(() => String)
  @ApiModelProperty({ description: 'promoteUser' })
  readonly promoteUser: string;
}

export class UserMerchantDTO {
  @IsMongoId()
  @Type(() => String)
  @ApiModelProperty({ description: '默认提货点' })
  readonly merchant: string;
}