import { Controller, Get, Query, UseGuards, Inject } from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { KDBirdUtil } from 'src/utils/kdbird.util';


@ApiUseTags('express')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('api/express')
export class ApiExpressController {
  constructor(
    @Inject(KDBirdUtil) private kdBirdUtil: KDBirdUtil,
  ) { }


  @Get('/')
  @ApiOkResponse({
    description: '快递公司列表',
  })
  @ApiOperation({ title: '快递公司列表', description: '快递公司列表' })
  async list(
    @Query('code') code: number,
  ): Promise<any> {
    return await this.kdBirdUtil.queryShipperCode(code)
  }
}