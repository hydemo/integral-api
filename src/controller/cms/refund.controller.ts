import { Body, Controller, Get, Param, Post, Query, UseGuards, Inject, Request, Put, Response, Delete } from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RefundService } from 'src/module/refund/refund.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { ShipperService } from 'src/module/shipper/shipper.service';
import { CreateAddressDTO } from 'src/module/address/address.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UpdatePriceDTO, RefuseDTO } from 'src/module/refund/refund.dto';


@ApiUseTags('cms/refund')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/refunds')
export class CMSRefundController {
  constructor(
    @Inject(RefundService) private refundService: RefundService,
    @Inject(ShipperService) private shipperService: ShipperService,
  ) { }


  @Get('/')
  @Roles(1)
  @ApiOkResponse({
    description: '退货退款列表',
  })
  @ApiOperation({ title: '退货退款列表', description: '退货退款列表, checkResult' })
  async list(
    @Query() pagination: Pagination,
  ): Promise<any> {
    return await this.refundService.list(pagination)
  }

  @Get('/:id')
  @Roles(1)
  @ApiOkResponse({
    description: '退货退款详情',
  })
  @ApiOperation({ title: '退货退款详情', description: '退货退款详情' })
  async findById(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.refundService.getRecord(id)
  }

  @Put('/:id/confirm')
  @Roles(1)
  @ApiOkResponse({
    description: '通过审核',
  })
  @ApiOperation({ title: '通过审核', description: '通过审核' })
  async confirm(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() address: CreateAddressDTO,
  ): Promise<any> {
    return await this.refundService.confirm(id, address)
  }

  @Put('/:id/refund')
  @Roles(1)
  @ApiOkResponse({
    description: '确认收货',
  })
  @ApiOperation({ title: '确认收货', description: '确认收货' })
  async refund(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.refundService.refund(id)
  }

  @Put('/:id/address')
  @Roles(1)
  @ApiOkResponse({
    description: '修改地址',
  })
  @ApiOperation({ title: '修改地址', description: '修改地址' })
  async changeAddress(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() address: CreateAddressDTO,
  ): Promise<any> {
    return await this.refundService.changeAddress(id, address)
  }

  @Put('/:id/refuse')
  @Roles(1)
  @ApiOkResponse({
    description: '拒绝',
  })
  @ApiOperation({ title: '拒绝', description: '拒绝' })
  async refuse(
    @Body() refuse: RefuseDTO,
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.refundService.refuse(id, refuse)
  }

  @Put('/:id/price')
  @Roles(1)
  @ApiOkResponse({
    description: '修改价格',
  })
  @ApiOperation({ title: '修改价格', description: '修改价格' })
  async changePrice(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() price: UpdatePriceDTO,
  ): Promise<any> {
    return await this.refundService.changePrice(id, price)
  }

  @Get('/:id/traces')
  @Roles(1)
  @ApiOkResponse({
    description: '物流信息',
  })
  @ApiOperation({ title: '物流信息', description: '物流信息' })
  async traces(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.shipperService.traces(id)
  }
}