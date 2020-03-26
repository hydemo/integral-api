import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UseGuards,
	Inject,
	Request,
	Put,
	Response,
	Delete,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { RefundService } from 'src/module/refund/refund.service';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { ShipperService } from 'src/module/shipper/shipper.service';
import { CreateShipperDTO } from 'src/module/shipper/shipper.dto';

@ApiUseTags('refund')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('api/refunds')
export class ApiRefundController {
	constructor(
		@Inject(RefundService) private refundService: RefundService,
		@Inject(ShipperService) private shipperService: ShipperService,
	) {}

	@Get('/')
	@ApiOkResponse({
		description: '退货退款列表',
	})
	@ApiOperation({
		title: '退货退款列表',
		description: '状态 1:待审核 2:待发货 3:待退款 4:完成 5:已拒绝',
	})
	async list(
		@Query() pagination: Pagination,
		@Request() req: any,
		@Query('checkResult') checkResult?: number,
	): Promise<any> {
		return await this.refundService.listByUser(
			pagination,
			req.user._id,
			Number(checkResult),
		);
	}

	@Put('/:id/send')
	@ApiOkResponse({
		description: '发货',
	})
	@ApiOperation({ title: '支付退货退款', description: '支付退货退款' })
	async pay(
		@Param('id', new MongodIdPipe()) id: string,
		@Body() send: CreateShipperDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.refundService.send(id, send, req.user._id);
	}

	@Delete('/:id')
	@ApiOkResponse({
		description: '删除或取消',
	})
	@ApiOperation({ title: '取消退货退款', description: '取消退货退款' })
	async cancel(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return await this.refundService.cancel(id, req.user._id);
	}

	@Get('/:id')
	@ApiOkResponse({
		description: '订单详情',
	})
	@ApiOperation({ title: '订单详情', description: '订单详情' })
	async detail(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return await this.refundService.detail(id, req.user._id);
	}

	@Get('/:id/traces')
	@ApiOkResponse({
		description: '物流信息',
	})
	@ApiOperation({ title: '物流信息', description: '物流信息' })
	async traces(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return await this.shipperService.traces(id);
	}
}
