import { Body, Controller, Get, Param, Post, Query, UseGuards, Inject, Request, Put, Response, Delete } from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';
import * as moment from 'moment'
import { AuthGuard } from '@nestjs/passport';
import { RechargeService } from 'src/module/recharge/recharge.service';
import { RechargeDTO } from 'src/module/user/users.dto';
import { UserCouponService } from 'src/module/userCoupon/userCoupon.service';
import { Pagination } from 'src/common/dto/pagination.dto';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';
import { ApiException } from 'src/common/expection/api.exception';
import { IntegrationService } from 'src/module/integration/integration.service';
import { CreateIntegrationDTO } from 'src/module/integration/integration.dto';
import { UserService } from 'src/module/user/user.service';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { UserMerchantDTO } from 'src/module/user/login.dto';
import { MerchantService } from 'src/module/merchant/merchant.service';


@ApiUseTags('user')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('users')
export class ApiUserController {
  constructor(
    @Inject(RechargeService) private rechargeService: RechargeService,
    @Inject(UserCouponService) private userCouponService: UserCouponService,
    @Inject(IntegrationService) private integrationService: IntegrationService,
    @Inject(UserService) private userService: UserService,
    @Inject(MerchantService) private merchantService: MerchantService,
  ) { }

  @Get('/balance')
  @ApiOkResponse({
    description: '余额',
  })
  @ApiOperation({ title: '余额', description: '余额' })
  async list(
    @Request() req: any,
  ): Promise<any> {
    return req.user.balance
  }
  @Get('/integration')
  @ApiOkResponse({
    description: '用户积分',
  })
  @ApiOperation({ title: '用户积分', description: '用户积分' })
  async integration(
    @Request() req: any,
  ): Promise<any> {
    return { integration: req.user.integration, integrationTotal: req.user.integrationTotal, vip: req.user.vip }
  }

  @Post('/recharge')
  @ApiOkResponse({
    description: '充值',
  })
  @ApiOperation({ title: '充值', description: '充值' })
  async recharge(
    @Body() recharge: RechargeDTO,
    @Request() req: any,
  ): Promise<any> {
    return await this.rechargeService.recharge(recharge, req.user._id)
  }

  @Get('/sign')
  @ApiOkResponse({
    description: '判断用户是否签到',
  })
  @ApiOperation({ title: '判断用户是否签到', description: '判断用户是否签到 true:已签到 false:未签到' })
  async signCheck(
    @Request() req: any,
  ): Promise<any> {
    const today = moment().startOf('D')
    if (req.user.signTime && moment(req.user.signTime) > moment(today)) {
      return true
    }
    return false
  }

  @Post('/sign')
  @ApiOkResponse({
    description: '签到',
  })
  @ApiOperation({ title: '签到', description: '签到' })
  async sign(
    @Request() req: any,
  ): Promise<any> {
    const today = moment().startOf('D')
    if (req.user.signTime && moment(req.user.signTime) > moment(today)) {
      throw new ApiException('已签到', ApiErrorCode.NO_PERMISSION, 403)
    }
    const newIntegration: CreateIntegrationDTO = {
      user: req.user._id,
      count: 10,
      type: 'add',
      sourceType: 3,
      sourceId: req.user._id
    }
    await this.integrationService.create(newIntegration)
    await this.userService.updateById(req.user._id, { signTime: Date.now() })
  }

  @Get('/coupons')
  @ApiOkResponse({
    description: '红包优惠券数量',
  })
  @ApiOperation({ title: '红包优惠券数量', description: '红包优惠券数量' })
  async coupons(
    @Query() pagination: Pagination,
    @Query('type') type: number,
    @Query('tab') tab: number,
    @Request() req: any
  ): Promise<any> {
    return await this.userCouponService.list(pagination, Number(type), Number(tab), req.user._id)
  }

  @Get('/coupons/count')
  @ApiOkResponse({
    description: '红包优惠券数量',
  })
  @ApiOperation({ title: '红包优惠券数量', description: '红包优惠券数量' })
  async couponCount(
    @Request() req: any,
  ): Promise<any> {
    return await this.userCouponService.count(req.user._id)
  }

  @Put('/:id/merchant')
  @ApiOkResponse({
    description: '设置默认提货点',
  })
  @ApiOperation({ title: '设置默认提货点', description: '设置默认提货点' })
  async merchant(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() merchant: UserMerchantDTO,
  ): Promise<any> {
    await this.userService.updateById(id, merchant)
    return await this.merchantService.findById(merchant.merchant)
  }

}