import {
	Body,
	Controller,
	Get,
	Param,
	Query,
	UseGuards,
	Inject,
	Request,
	Put,
	Response,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiBearerAuth,
} from '@nestjs/swagger';
import * as fs from 'fs';
import { OrderService } from 'src/module/order/order.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { UpdatePriceDTO, OrderMessageDTO } from 'src/module/order/order.dto';
import { CreateShipperDTO } from 'src/module/shipper/shipper.dto';
import { ShipperService } from 'src/module/shipper/shipper.service';
import { CreateAddressDTO } from 'src/module/address/address.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RefundService } from 'src/module/refund/refund.service';

@ApiUseTags('cms/order')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/orders')
export class CMSOrderController {
	constructor(
		@Inject(OrderService) private orderService: OrderService,
		@Inject(RefundService) private refundService: RefundService,
		@Inject(ShipperService) private shipperService: ShipperService,
	) {}

	@Get('/')
	@Roles(1)
	@ApiOkResponse({
		description: '订单列表',
	})
	@ApiOperation({ title: '订单列表', description: '订单列表, checkResult' })
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.orderService.list(pagination);
	}

	@Get('/download')
	@Roles(1)
	@ApiOkResponse({
		description: '订单列表',
	})
	@ApiOperation({ title: '订单列表', description: '订单列表, checkResult' })
	async download(
		@Request() req: any,
		@Response() res: any,
		@Query('type') type: number,
		@Query('ids') ids: string,
	): Promise<any> {
		const userAgent = (req.headers['user-agent'] || '').toLowerCase();

		const filename = await this.orderService.download(
			'temp',
			Number(type),
			ids,
		);
		const path = `temp/${filename}`;

		let disposition;
		if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
			disposition = `attachment; filename=${encodeURIComponent(filename)}`;
		} else if (userAgent.indexOf('firefox') >= 0) {
			disposition = `attachment; filename*="utf8''${encodeURIComponent(
				filename,
			)}"`;
		} else {
			/* safari等其他非主流浏览器只能自求多福了 */
			disposition = `attachment; filename=${new Buffer(filename).toString(
				'binary',
			)}`;
		}
		res.writeHead(200, {
			'Content-Type': 'application/octet-stream;charset=utf8',
			'Content-Disposition': disposition,
		});
		const stream = fs.createReadStream(path);
		stream.pipe(res);
		stream
			.on('end', () => {
				fs.exists(path, exists => {
					if (exists) fs.unlink(path, err => {});
				});
				return;
			})
			.on('error', err => {
				return;
			});
	}

	@Get('/:id')
	@Roles(1)
	@ApiOkResponse({
		description: '订单详情',
	})
	@ApiOperation({ title: '订单详情', description: '订单详情' })
	async findById(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		return await this.orderService.getRecord(id);
	}

	@Put('/:id/send')
	@Roles(1)
	@ApiOkResponse({
		description: '发货',
	})
	@ApiOperation({ title: '发货', description: '发货' })
	async send(
		@Param('id', new MongodIdPipe()) id: string,
		@Body() shipper: CreateShipperDTO,
	): Promise<any> {
		return await this.orderService.sendOrder(id, shipper);
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
		@Request() req: any,
	): Promise<any> {
		return await this.orderService.changeAddress(id, address);
	}

	@Put('/:id/message')
	@Roles(1)
	@ApiOkResponse({
		description: '商家留言',
	})
	@ApiOperation({ title: '商家留言', description: '商家留言' })
	async message(
		@Param('id', new MongodIdPipe()) id: string,
		@Body() message: OrderMessageDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.orderService.message(id, message);
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
		return await this.orderService.changePrice(id, price);
	}

	@Put('/:id/refund')
	@Roles(1)
	@ApiOkResponse({
		description: '退款',
	})
	@ApiOperation({ title: '退款', description: '退款' })
	async refund(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		return await this.refundService.refundOrder(id);
	}

	@Get('/:id/traces')
	@Roles(1)
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
