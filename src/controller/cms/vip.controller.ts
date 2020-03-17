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
import { CreateVipDTO } from 'src/module/vip/vip.dto';
import { VipService } from 'src/module/vip/vip.service';
@ApiUseTags('cms/vip')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/vips')
export class CMSVipController {
  constructor(
    private vipService: VipService,
  ) { }

  @Get('/')
  @Roles(1)
  @ApiOkResponse({
    description: '会员列表',
  })
  @ApiOperation({ title: '会员列表', description: '会员列表' })
  async list(
    @Query() pagination: Pagination,
  ): Promise<any> {
    return await this.vipService.list(pagination)
  }

  @Get('/id')
  @Roles(1)
  @ApiOkResponse({
    description: '会员详情',
  })
  @ApiOperation({ title: '会员详情', description: '会员详情' })
  async detail(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.vipService.detail(id)
  }

  @Post('/')
  @Roles(1)
  @ApiOkResponse({
    description: '新增会员',
  })
  @ApiOperation({ title: '新增会员', description: '新增会员' })
  async create(
    @Body() vip: CreateVipDTO,
    @Request() req: any
  ): Promise<any> {
    return await this.vipService.create(vip, String(req.user._id))
  }

  @Put('/:id')
  @Roles(1)
  @ApiOkResponse({
    description: '修改会员',
  })
  @ApiOperation({ title: '修改会员', description: '修改会员' })
  async update(
    @Body() vip: CreateVipDTO,
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.vipService.update(id, vip)
  }

  @Delete('/:id')
  @Roles(1)
  @ApiOkResponse({
    description: '删除会员',
  })
  @ApiOperation({ title: '删除会员', description: '删除会员' })
  async remove(
    @Param('id', new MongodIdPipe()) id: string,
    @Request() req: any
  ): Promise<any> {
    return await this.vipService.remove(id)
  }
}