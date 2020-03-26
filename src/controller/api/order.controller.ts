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
import { OrderService } from 'src/module/order/order.service';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import {
	CreateOrderByProductDTO,
	CreateOrderByCartDTO,
	ConfirmOrderDTO,
} from 'src/module/order/order.dto';
import { CreateCommentDTO } from 'src/module/comment/comment.dto';
import { ShipperService } from 'src/module/shipper/shipper.service';
import { CreateRefundDTO } from 'src/module/refund/refund.dto';
import { RefundService } from 'src/module/refund/refund.service';
import { ShipFeeService } from 'src/module/shipFee/shipFee.service';

@ApiUseTags('order')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('api/orders')
export class ApiOrderController {
	constructor(
		@Inject(OrderService) private orderService: OrderService,
		@Inject(ShipperService) private shipperService: ShipperService,
		@Inject(RefundService) private refundService: RefundService,
		@Inject(ShipFeeService) private shipFeeService: ShipFeeService,
	) {}

	@Get('/')
	@ApiOkResponse({
		description: '订单列表',
	})
	@ApiOperation({
		title: '订单列表',
		description:
			'订单列表 状态 0:待确认 1:待付款 2:待发货 3：待收货 4:待评价 5:完成 6:退款',
	})
	async list(
		@Query() pagination: Pagination,
		@Request() req: any,
		@Query('checkResult') checkResult?: number,
	): Promise<any> {
		return await this.orderService.listByUser(
			pagination,
			req.user._id,
			Number(checkResult),
		);
	}

	@Get('/count')
	@ApiOkResponse({
		description: '订单数统计',
	})
	@ApiOperation({ title: '订单数统计' })
	async count(@Request() req: any): Promise<any> {
		const refund = await this.refundService.count(req.user._id);
		const orderCount = await this.orderService.count(req.user._id);
		return { ...orderCount, refund };
	}

	@Post('/product')
	@ApiOkResponse({
		description: '商品生成订单',
	})
	@ApiOperation({ title: '商品生成订单', description: '商品生成订单' })
	async createByProduct(
		@Body() order: CreateOrderByProductDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.orderService.createByProduct(order, req.user);
	}

	@Post('/cart')
	@ApiOkResponse({
		description: '购物车生成订单',
	})
	@ApiOperation({ title: '商品生成订单', description: '商品生成订单' })
	async create(
		@Body() order: CreateOrderByCartDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.orderService.createByCart(order, req.user);
	}

	@Put('/:id')
	@ApiOkResponse({
		description: '确认订单',
	})
	@ApiOperation({ title: '确认订单', description: '确认订单' })
	async update(
		@Param('id', new MongodIdPipe()) id: string,
		@Body() order: ConfirmOrderDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.orderService.confirmOrder(id, order, req.user);
	}

	@Put('/:id/complete')
	@ApiOkResponse({
		description: '完成订单',
	})
	@ApiOperation({ title: '完成订单', description: '完成订单' })
	async complete(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return await this.orderService.complete(id, req.user._id);
	}

	@Get('/:id/shipFee')
	@ApiOkResponse({
		description: '获取物流费用',
	})
	@ApiOperation({ title: '获取物流费用', description: '获取物流费用' })
	async getShipFee(
		@Query('province') province: string,
		@Query('price') price: number,
	): Promise<any> {
		return await this.shipFeeService.getShipFee(province, price);
	}

	@Post('/:id/refund')
	@ApiOkResponse({
		description: '申请退货退款',
	})
	@ApiOperation({ title: '申请退货退款', description: '申请退货退款' })
	async refund(
		@Param('id', new MongodIdPipe()) id: string,
		@Body() refund: CreateRefundDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.refundService.create(id, refund, req.user._id);
	}

	@Put('/:id/receive')
	@ApiOkResponse({
		description: '确认收货',
	})
	@ApiOperation({ title: '确认收货', description: '确认收货' })
	async receive(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return await this.orderService.receive(id, req.user);
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
		return await this.orderService.detail(id, req.user._id);
	}

	@Delete('/:id')
	@ApiOkResponse({
		description: '取消订单',
	})
	@ApiOperation({ title: '取消订单', description: '取消订单' })
	async cancel(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return await this.orderService.cancel(id, req.user._id);
	}

	@Put('/:id/pay')
	@ApiOkResponse({
		description: '支付订单',
	})
	@ApiOperation({ title: '支付订单', description: '支付订单' })
	async pay(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return await this.orderService.pay(id, req.user);
	}

	@Get('/:id/integration')
	@ApiOkResponse({
		description: '获取可用积分',
	})
	@ApiOperation({ title: '获取可用积分', description: '获取可用积分' })
	async integration(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return req.user.integration;
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

	@Post('/:id/good/:goodId/comments')
	@ApiOkResponse({
		description: '订单评论',
	})
	@ApiOperation({ title: '订单评论', description: '订单评论' })
	async remove(
		@Param('id', new MongodIdPipe()) id: string,
		@Param('goodId', new MongodIdPipe()) goodId: string,
		@Body() comment: CreateCommentDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.orderService.comment(id, goodId, req.user._id, comment);
	}
}
