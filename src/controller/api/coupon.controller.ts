import {
  Controller,
  Request,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { Pagination } from 'src/common/dto/pagination.dto';
import { CouponService } from 'src/module/coupon/coupon.service';
import { UserCouponService } from 'src/module/userCoupon/userCoupon.service';
import { AuthGuard } from '@nestjs/passport';
@ApiUseTags('api/coupon')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/coupons')
export class ApiCouponController {
  constructor(
    private couponService: CouponService,
    private userCouponService: UserCouponService,
  ) { }

  @Get('/')
  @ApiOkResponse({
    description: '红包/优惠券列表',
  })
  @ApiOperation({ title: '红包/优惠券列表', description: '红包/优惠券列表, target:1:普通，:新人专享 type：1：红包 2:优惠券' })
  async list(
    @Query('type') type: number,
    @Request() req: any
  ): Promise<any> {
    const userCoupons = await this.userCouponService.all(req.user._id)
    const coupons = await this.couponService.coupons(Number(type), req.user)
    let newUserCoupons = []
    if (req.user.isNewUser) {
      newUserCoupons = await this.couponService.newUser()
    }
    return { coupons, userCoupons, newUserCoupons }
  }

  @Get('/packet')
  @ApiOkResponse({
    description: '打包领取',
  })
  @ApiOperation({ title: '打包领取', description: '打包领取' })
  async getPacket(
    @Request() req: any,
  ): Promise<any> {
    // return 'success'
    return await this.couponService.getPacket(req.user)
  }

  @Get('/:id')
  @ApiOkResponse({
    description: '领取红包/优惠券',
  })
  @ApiOperation({ title: '领取红包/优惠券', description: '领取红包/优惠券' })
  async detail(
    @Param('id', new MongodIdPipe()) id: string,
    @Request() req: any,
  ): Promise<any> {
    return await this.couponService.getCoupon(id, req.user)
  }
}