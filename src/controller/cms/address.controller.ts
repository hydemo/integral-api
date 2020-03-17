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
import { Roles } from 'src/common/decorator/roles.decorator';


@ApiUseTags('cms/address')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/address')
export class CMSAddressController {
  constructor(
    @Inject(AddressService) private addressService: AddressService,
  ) { }


  @Get('/')
  @Roles(1)
  @ApiOkResponse({
    description: '收货地址列表',
  })
  @ApiOperation({ title: '收货地址列表', description: '收货地址列表' })
  async list(
    @Query() pagination: Pagination,
  ): Promise<any> {
    return await this.addressService.merchantList(pagination)
  }

  @Post('/')
  @Roles(1)
  @ApiOkResponse({
    description: '添加收货地址',
  })
  @ApiOperation({ title: '添加收货地址', description: '添加收货地址' })
  async create(
    @Body() address: CreateAddressDTO,
  ): Promise<any> {
    return await this.addressService.createMerchantAddress(address)
  }

  @Put('/:id')
  @Roles(1)
  @ApiOkResponse({
    description: '修改收货地址',
  })
  @ApiOperation({ title: '修改收货地址', description: '修改收货地址' })
  async update(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() address: CreateAddressDTO,
  ): Promise<any> {
    return await this.addressService.updateByMerchant(id, address)
  }

  @Delete('/:id')
  @Roles(1)
  @ApiOkResponse({
    description: '删除收货地址',
  })
  @ApiOperation({ title: '删除收货地址', description: '删除收货地址' })
  async remove(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.addressService.removeByMerchant(id)
  }

}