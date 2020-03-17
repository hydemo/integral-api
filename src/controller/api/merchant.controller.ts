import { Body, Controller, Get, Param, Post, Query, UseGuards, Inject, Request, Put, Response, Delete, Req } from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { PayDTO } from 'src/module/merchant/merchant.dto';
import { MerchantService } from 'src/module/merchant/merchant.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';


@ApiUseTags('merchant')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/merchants')
export class ApiMerchantController {
  constructor(
    @Inject(MerchantService) private merchantService: MerchantService,
  ) { }


  @Get('/')
  @ApiOkResponse({
    description: '商户列表',
  })
  @ApiOperation({ title: '商户列表', description: '商户列表' })
  async list(
    @Query() pagination: Pagination,
  ): Promise<any> {
    return await this.merchantService.listByUser(pagination)

  }

  @Get('/:id')
  @ApiOkResponse({
    description: '商户详情',
  })
  @ApiOperation({ title: '商户详情', description: '商户详情' })
  async detail(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.merchantService.findById(id)

  }

  @Post('/:id/pay')
  @ApiOkResponse({
    description: '支付',
  })
  @UseGuards(AuthGuard())
  @ApiOperation({ title: '支付', description: '支付' })
  async pay(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() pay: PayDTO,
    @Request() req: any
  ): Promise<any> {
    return await this.merchantService.pay(id, pay, req.user)

  }
}