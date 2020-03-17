import {
  UseGuards,
  Controller,
  Request,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { Pagination } from 'src/common/dto/pagination.dto';
import { CreateNoticeDTO } from 'src/module/notice/notice.dto';
import { NoticeService } from 'src/module/notice/notice.service';
@ApiUseTags('cms/notice')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/notice')
export class CMSNoticeController {
  constructor(
    private noticeService: NoticeService,
  ) { }

  @Get('/')
  @Roles(1)
  @ApiOkResponse({
    description: '订单通知列表',
  })
  @ApiOperation({ title: '订单通知列表', description: '订单通知列表' })
  async list(
    @Query() pagination: Pagination,
  ): Promise<any> {
    return await this.noticeService.list(pagination)
  }

  @Get('/id')
  @Roles(1)
  @ApiOkResponse({
    description: '订单通知详情',
  })
  @ApiOperation({ title: '订单通知详情', description: '订单通知详情' })
  async detail(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.noticeService.detail(id)
  }

  @Post('/')
  @Roles(1)
  @ApiOkResponse({
    description: '新增订单通知',
  })
  @ApiOperation({ title: '新增订单通知', description: '新增订单通知' })
  async create(
    @Body() notice: CreateNoticeDTO,
    @Request() req: any
  ): Promise<any> {
    return await this.noticeService.create(notice, String(req.user._id))
  }

  @Put('/:id')
  @Roles(1)
  @ApiOkResponse({
    description: '修改订单通知',
  })
  @ApiOperation({ title: '修改订单通知', description: '修改订单通知' })
  async update(
    @Body() notice: CreateNoticeDTO,
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.noticeService.update(id, notice)
  }

  @Delete('/:id')
  @Roles(1)
  @ApiOkResponse({
    description: '删除订单通知',
  })
  @ApiOperation({ title: '删除订单通知', description: '删除订单通知' })
  async remove(
    @Param('id', new MongodIdPipe()) id: string,
    @Request() req: any
  ): Promise<any> {
    return await this.noticeService.remove(id, String(req.user._id))
  }

  @Put('/:id/recover')
  @Roles(1)
  @ApiOkResponse({
    description: '恢复订单通知',
  })
  @ApiOperation({ title: '恢复订单通知', description: '恢复订单通知' })
  async recover(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.noticeService.recover(id)
  }

  @Put('/:id/phoneNotice')
  @Roles(1)
  @ApiOkResponse({
    description: '修改短信通知权限',
  })
  @ApiOperation({ title: '修改短信通知权限', description: '修改短信通知权限' })
  async phoneNotice(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() data: { key: boolean },
  ): Promise<any> {
    return await this.noticeService.phoneNotice(id, data.key)
  }

  @Put('/:id/weixinNotice')
  @Roles(1)
  @ApiOkResponse({
    description: '修改微信通知权限',
  })
  @ApiOperation({ title: '修改微信通知权限', description: '修改微信通知权限' })
  async weixinNotice(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() data: { key: boolean },
  ): Promise<any> {
    return await this.noticeService.weixinNotice(id, data.key)
  }

}