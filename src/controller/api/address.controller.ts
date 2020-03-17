import { Body, Controller, Get, Param, Post, Query, UseGuards, Inject, Request, Put, Response, Delete } from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateAddressDTO } from 'src/module/address/address.dto';
import { AddressService } from 'src/module/address/address.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';


@ApiUseTags('address')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('api/address')
export class ApiAddressController {
  constructor(
    @Inject(AddressService) private addressService: AddressService,
  ) { }


  @Get('/')
  @ApiOkResponse({
    description: '收货地址列表',
  })
  @ApiOperation({ title: '收货地址列表', description: '收货地址列表' })
  async list(
    @Query() pagination: Pagination,
    @Request() req: any,
  ): Promise<any> {
    return await this.addressService.list(pagination, req.user._id)
  }

  @Post('/')
  @ApiOkResponse({
    description: '添加收货地址',
  })
  @ApiOperation({ title: '收货地址列表', description: '收货地址列表' })
  async create(
    @Body() address: CreateAddressDTO,
    @Request() req: any,
  ): Promise<any> {
    return await this.addressService.create(address, req.user._id)
  }

  @Put('/:id')
  @ApiOkResponse({
    description: '添加收货地址',
  })
  @ApiOperation({ title: '收货地址列表', description: '收货地址列表' })
  async update(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() address: CreateAddressDTO,
    @Request() req: any,
  ): Promise<any> {
    return await this.addressService.findByIdAndUpdate(id, req.user._id, address)
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: '删除收货地址',
  })
  @ApiOperation({ title: '删除收货地址', description: '删除收货地址' })
  async remove(
    @Param('id', new MongodIdPipe()) id: string,
    @Request() req: any,
  ): Promise<any> {
    return await this.addressService.findByIdAndRemove(id, req.user._id)
  }

  @Put('/:id/default')
  @ApiOkResponse({
    description: '设为默认',
  })
  @ApiOperation({ title: '设为默认', description: '设为默认' })
  async setDefault(
    @Param('id', new MongodIdPipe()) id: string,
    @Request() req: any,
  ): Promise<any> {
    return await this.addressService.setDefault(id, req.user._id)
  }
}