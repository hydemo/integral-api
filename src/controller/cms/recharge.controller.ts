import { Body, Controller, Get, Param, Post, Query, UseGuards, Inject, Request, Put, Response, Delete } from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateRechargeDTO } from 'src/module/recharge/recharge.dto';
import { RechargeService } from 'src/module/recharge/recharge.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';


@ApiUseTags('cms/recharge')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/recharges')
export class CMSRechargeController {
  constructor(
    @Inject(RechargeService) private rechargeService: RechargeService,
  ) { }


  @Get('/')
  @Roles(1)
  @ApiOkResponse({
    description: '充值卡列表',
  })
  @ApiOperation({ title: '充值卡列表', description: '充值卡列表' })
  async list(
    @Query() pagination: Pagination,
  ): Promise<any> {
    return await this.rechargeService.list(pagination)

  }

  @Post('/')
  @Roles(1)
  @ApiOkResponse({
    description: '新增充值卡',
  })
  @ApiOperation({ title: '新增充值卡', description: '新增充值卡' })
  async add(
    @Body() recharge: CreateRechargeDTO,
    @Request() req: any
  ): Promise<any> {
    return await this.rechargeService.create(recharge, String(req.user._id))
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: '删除',
  })
  @Roles(1)
  @ApiOperation({ title: '删除', description: '删除' })
  async removeByRecharge(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.rechargeService.findByIdAndRemove(id)
  }

  @Put('/:id')
  @ApiOkResponse({
    description: '修改',
  })
  @Roles(1)
  @ApiOperation({ title: '修改', description: '修改' })
  async recoverByRecharge(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() recharge: CreateRechargeDTO,
  ): Promise<any> {
    return await this.rechargeService.findByIdAndUpdate(id, recharge)
  }

  @Put('/:id/recover')
  @ApiOkResponse({
    description: '恢复',
  })
  @Roles(1)
  @ApiOperation({ title: '恢复', description: '恢复' })
  async recoverByAdmin(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.rechargeService.recoverById(id)
  }
}