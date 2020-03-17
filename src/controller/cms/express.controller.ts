import { Body, Controller, Get, Param, Post, Query, UseGuards, Inject, Request, Put, Response, Delete } from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { KDBirdUtil } from 'src/utils/kdbird.util';
import { Roles } from 'src/common/decorator/roles.decorator';


@ApiUseTags('cms/express')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/express')
export class CMSExpressController {
  constructor(
    @Inject(KDBirdUtil) private kdBirdUtil: KDBirdUtil,
  ) { }


  @Get('/')
  @Roles(1)
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