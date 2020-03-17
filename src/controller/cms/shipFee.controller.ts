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
import { CreateShipFeeDTO } from 'src/module/shipFee/shipFee.dto';
import { ShipFeeService } from 'src/module/shipFee/shipFee.service';
@ApiUseTags('cms/shipFee')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/shipFees')
export class CMSShipFeeController {
  constructor(
    private shipFeeService: ShipFeeService,
  ) { }

  @Get('/')
  @Roles(1)
  @ApiOkResponse({
    description: '物流费用列表',
  })
  @ApiOperation({ title: '物流费用列表', description: '物流费用列表' })
  async list(
    @Query() pagination: Pagination,
  ): Promise<any> {
    return await this.shipFeeService.list(pagination)
  }

  @Get('/id')
  @Roles(1)
  @ApiOkResponse({
    description: '物流费用详情',
  })
  @ApiOperation({ title: '物流费用详情', description: '物流费用详情' })
  async detail(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.shipFeeService.detail(id)
  }

  @Post('/')
  @Roles(1)
  @ApiOkResponse({
    description: '新增物流费用',
  })
  @ApiOperation({ title: '新增物流费用', description: '新增物流费用' })
  async create(
    @Body() shipFee: CreateShipFeeDTO,
    @Request() req: any
  ): Promise<any> {
    return await this.shipFeeService.create(shipFee, String(req.user._id))
  }

  @Put('/:id')
  @Roles(1)
  @ApiOkResponse({
    description: '修改物流费用',
  })
  @ApiOperation({ title: '修改物流费用', description: '修改物流费用' })
  async update(
    @Body() shipFee: CreateShipFeeDTO,
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.shipFeeService.update(id, shipFee)
  }

  @Delete('/:id')
  @Roles(1)
  @ApiOkResponse({
    description: '删除物流费用',
  })
  @ApiOperation({ title: '删除物流费用', description: '删除物流费用' })
  async remove(
    @Param('id', new MongodIdPipe()) id: string,
    @Request() req: any
  ): Promise<any> {
    return await this.shipFeeService.remove(id, String(req.user._id))
  }

  @Put('/:id/recover')
  @Roles(1)
  @ApiOkResponse({
    description: '恢复物流费用',
  })
  @ApiOperation({ title: '恢复物流费用', description: '恢复物流费用' })
  async recover(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.shipFeeService.recover(id)
  }
}