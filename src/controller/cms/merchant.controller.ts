import { Body, Controller, Get, Param, Post, Query, UseGuards, Inject, Request, Put, Response, Delete } from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateMerchantDTO } from 'src/module/merchant/merchant.dto';
import { MerchantService } from 'src/module/merchant/merchant.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { MerchantBillService } from 'src/module/merchantBill/merchantBill.service';


@ApiUseTags('cms/merchant')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/merchants')
export class CMSMerchantController {
  constructor(
    @Inject(MerchantService) private merchantService: MerchantService,
    @Inject(MerchantBillService) private merchantBillService: MerchantBillService,
  ) { }


  @Get('/')
  @Roles(1)
  @ApiOkResponse({
    description: '商户列表',
  })
  @ApiOperation({ title: '商户列表', description: '商户列表' })
  async list(
    @Query() pagination: Pagination,
  ): Promise<any> {
    return await this.merchantService.list(pagination)

  }

  @Get('/:id/bills')
  @Roles(1)
  @ApiOkResponse({
    description: '商户流水',
  })
  @ApiOperation({ title: '商户流水', description: '商户流水' })
  async bills(
    @Param('id', new MongodIdPipe()) id: string,
    @Query() pagination: Pagination,
  ): Promise<any> {
    return await this.merchantBillService.list(pagination, id)
  }

  @Post('/')
  @Roles(1)
  @ApiOkResponse({
    description: '新增商户',
  })
  @ApiOperation({ title: '新增商户', description: '新增商户' })
  async add(
    @Body() merchant: CreateMerchantDTO,
    @Request() req: any
  ): Promise<any> {
    return await this.merchantService.create(merchant, String(req.user._id))
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: '删除',
  })
  @Roles(1)
  @ApiOperation({ title: '删除', description: '删除' })
  async removeByMerchant(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.merchantService.findByIdAndRemove(id)
  }

  @Put('/:id')
  @ApiOkResponse({
    description: '修改',
  })
  @Roles(1)
  @ApiOperation({ title: '修改', description: '修改' })
  async recoverByMerchant(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() merchant: CreateMerchantDTO,
  ): Promise<any> {
    return await this.merchantService.findByIdAndUpdate(id, merchant)
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
    return await this.merchantService.recoverById(id)
  }
}