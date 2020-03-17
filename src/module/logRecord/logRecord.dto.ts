import { ApiModelProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLogDTO {
  @IsMongoId()
  @Type(() => String)
  @ApiModelProperty({ description: '用户' })
  readonly user: string;

  @IsMongoId()
  @Type(() => String)
  @ApiModelProperty({ description: '关联id' })
  readonly bondToObjectId?: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '请求方法' })
  readonly method: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: 'ip' })
  readonly ip: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '接口' })
  readonly interface: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '模块' })
  readonly module: string;

  @IsString()
  @Type(() => String)
  @ApiModelProperty({ description: '描述' })
  readonly description: string;

}