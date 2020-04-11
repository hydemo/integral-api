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
import { CreateCouponDTO } from 'src/module/coupon/coupon.dto';
import { CouponService } from 'src/module/coupon/coupon.service';
@ApiUseTags('cms/coupon')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/coupons')
export class CMSCouponController {
	constructor(private couponService: CouponService) {}

	@Get('/')
	@Roles(0)
	@ApiOkResponse({
		description: '红包/优惠券列表',
	})
	@ApiOperation({ title: '红包/优惠券列表', description: '红包/优惠券列表' })
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.couponService.list(pagination);
	}

	@Get('/id')
	@Roles(0)
	@ApiOkResponse({
		description: '红包/优惠券详情',
	})
	@ApiOperation({ title: '红包/优惠券详情', description: '红包/优惠券详情' })
	async detail(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		return await this.couponService.detail(id);
	}

	@Post('/')
	@Roles(0)
	@ApiOkResponse({
		description: '新增红包/优惠券',
	})
	@ApiOperation({ title: '新增红包/优惠券', description: '新增红包/优惠券' })
	async create(
		@Body() coupon: CreateCouponDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.couponService.create(coupon, String(req.user._id));
	}

	@Put('/:id')
	@Roles(0)
	@ApiOkResponse({
		description: '修改红包/优惠券',
	})
	@ApiOperation({ title: '修改红包/优惠券', description: '修改红包/优惠券' })
	async update(
		@Body() coupon: CreateCouponDTO,
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.couponService.update(id, coupon);
	}

	@Delete('/:id')
	@Roles(0)
	@ApiOkResponse({
		description: '删除红包/优惠券',
	})
	@ApiOperation({ title: '删除红包/优惠券', description: '删除红包/优惠券' })
	async remove(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return await this.couponService.remove(id, String(req.user._id));
	}

	@Put('/:id/recover')
	@Roles(0)
	@ApiOkResponse({
		description: '恢复红包/优惠券',
	})
	@ApiOperation({ title: '恢复红包/优惠券', description: '恢复红包/优惠券' })
	async recover(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		return await this.couponService.recover(id);
	}
}
