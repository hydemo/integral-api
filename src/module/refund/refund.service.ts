import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { IRefund } from './refund.interfaces';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { IUser } from '../user/user.interfaces';
import { CreateShipperDTO } from '../shipper/shipper.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import {
	CreateRefundDTO,
	UpdatePriceDTO,
	RefuseDTO,
	RefundDTO,
	RefundProductDTO,
} from './refund.dto';
import { OrderService } from '../order/order.service';
import { IOrder } from '../order/order.interfaces';
import { CreateAddressDTO } from '../address/address.dto';
import { ShipperService } from '../shipper/shipper.service';
import { WeixinUtil } from 'src/utils/weixin.util';
import { UserBalanceService } from '../userBalance/userBalance.service';
import { CreateUserBalanceDTO } from '../userBalance/userBalance.dto';
import { CreateIntegrationDTO } from '../integration/integration.dto';
import { UserCouponService } from '../userCoupon/userCoupon.service';
import { IntegrationService } from '../integration/integration.service';
import { IntegrationSummaryService } from '../integrationSummary/integrationSummary.service';

@Injectable()
export class RefundService {
	constructor(
		@Inject('RefundModelToken') private readonly refundModel: Model<IRefund>,
		@Inject(OrderService) private readonly orderService: OrderService,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
		@Inject(ShipperService) private readonly shipperService: ShipperService,
		@Inject(UserBalanceService)
		private readonly userBalanceService: UserBalanceService,
		@Inject(IntegrationService)
		private readonly integrationService: IntegrationService,
		@Inject(WeixinUtil) private readonly weixinUtil: WeixinUtil,
		@Inject(IntegrationSummaryService)
		private readonly integrationSummaryService: IntegrationSummaryService,
	) {}

	/**
	 * 生成单号
	 */
	getRefundSn(): string {
		const length = 10;
		const time = moment().format('HHmmss');
		const random = Math.floor(Math.random() * Math.pow(8, length - 1) + 1);
		const randomLenght = random.toString().length;
		const fixLength = length - randomLenght;
		if (fixLength > 0) {
			return `40000000${time}${'0'.repeat(fixLength)}${random}`;
		}
		return `40000000${time}${random}`;
	}

	// 生成退款
	async create(
		id: string,
		refund: CreateRefundDTO,
		user: string,
	): Promise<boolean> {
		const order: IOrder | null = await this.orderService.findById(id);
		if (!order) {
			throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 404);
		}
		if (String(order.user) !== String(user)) {
			throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403);
		}
		let refundPrice = 0;
		const newProducts = refund.products.map(product => {
			const orderProduct = order.products.find(
				o => String(o.product) === product.product,
			);
			if (product.count <= 0) {
				throw new ApiException('数量有误', ApiErrorCode.INPUT_ERROR, 406);
			}
			if (!orderProduct) {
				throw new ApiException('产品不存在', ApiErrorCode.NO_EXIST, 404);
			}
			if (orderProduct.count - orderProduct.refundCount < product.count) {
				throw new ApiException('数量不足', ApiErrorCode.NO_PERMISSION, 403);
			}
			refundPrice +=
				(orderProduct.realPrice -
					orderProduct.promoteMinus -
					orderProduct.discountMinus -
					orderProduct.vipMinus -
					orderProduct.preSaleMinus) *
				product.count;
			orderProduct.refundCount += product.count;
			return {
				...orderProduct,
				count: product.count,
			};
		});

		const newRefund: RefundDTO = {
			reason: refund.reason,
			images: refund.images || [],
			user,
			order: id,
			refundSn: this.getRefundSn(),
			products: newProducts,
			refundPrice: Number(refundPrice.toFixed(2)),
			checkResult: 1,
			applicationTime: Date.now(),
			orderSn: order.orderSn,
			integration: order.integration,
			shippingFee: order.shippingFee,
		};
		await this.refundModel.create(newRefund);
		await this.orderService.updateProduct(order._id, order.products);
		return true;
	}

	// 统计数量
	async count(user) {
		return await this.refundModel.countDocuments({
			isDelete: false,
			user,
			checkResult: 1,
		});
	}
	// 确认退款
	async confirm(id: string, address: CreateAddressDTO) {
		const refund: IRefund | null = await this.refundModel
			.findById(id)
			.lean()
			.exec();
		if (!refund) {
			throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 406);
		}
		if (refund.checkResult !== 1) {
			throw new ApiException('订单有误', ApiErrorCode.NO_PERMISSION, 403);
		}
		return await this.refundModel.findByIdAndUpdate(id, {
			...address,
			checkResult: 2,
			confirmTime: Date.now(),
		});
	}

	// 退款订单
	async cancel(id: string, user: string): Promise<IOrder | null> {
		const refund = await this.refundModel
			.findById(id)
			.lean()
			.exec();

		if (!refund) {
			throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 404);
		}
		if (String(refund.user) !== String(user)) {
			throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403);
		}
		if (refund.checkResult === 1 || refund.checkResult === 2) {
			const order = await this.orderService.findById(refund.order);
			if (!order) {
				throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 404);
			}
			refund.products.map(product => {
				const orderProduct = order.products.find(
					o => String(o.product) === String(product.product),
				);
				if (!orderProduct) {
					throw new ApiException('产品不存在', ApiErrorCode.NO_EXIST, 404);
				}
				orderProduct.refundCount -= product.count;
			});
			await this.refundModel.findByIdAndDelete(id);
			await this.orderService.updateProduct(order._id, order.products);
			return null;
		}
		if (refund.checkResult === 4 || refund.checkResult !== 5) {
			await this.refundModel.findByIdAndUpdate(id, {
				isDelete: true,
				deleteTime: Date.now(),
			});
		}
		return null;
	}

	// 根据id查找
	async changePrice(
		id: string,
		price: UpdatePriceDTO,
	): Promise<IRefund | null> {
		return await this.refundModel
			.findByIdAndUpdate(id, price)
			.lean()
			.exec();
	}

	// 退款
	async refundOrder(id: string): Promise<IRefund | null> {
		const order: IOrder | null = await this.orderService.findByIdWithUser(id);
		if (!order) {
			throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 404);
		}
		let refundPrice = 0;
		const newProducts: any = order.products
			.map(product => {
				refundPrice +=
					(product.realPrice - product.promoteMinus) *
					(product.count - product.refundCount);
				if (refundPrice > order.actualPrice) {
					refundPrice = order.actualPrice;
				}
				const count = product.count - product.refundCount;
				if (count <= 0) {
					return null;
				}
				product.refundCount = product.count;
				return {
					...product,
					count,
				};
			})
			.filter(v => v);
		if (refundPrice > order.actualPrice) {
			refundPrice = order.orderPrice;
		}
		const { shippingFee = 0 } = order;
		refundPrice = Number((refundPrice - shippingFee).toFixed(2));
		if (!newProducts.length) {
			throw new ApiException('用户已申请退款', ApiErrorCode.INPUT_ERROR, 406);
		}
		const newRefund: RefundDTO = {
			reason: '商家退款',
			images: [],
			user: order.user._id,
			order: id,
			refundSn: this.getRefundSn(),
			products: newProducts,
			refundPrice: Number(refundPrice.toFixed(2)),
			checkResult: 1,
			applicationTime: Date.now(),
			orderSn: order.orderSn,
			confirmTime: Date.now(),
			integration: order.integration,
			shippingFee: order.shippingFee,
		};
		const refund = await this.refundModel.create(newRefund);
		await this.orderService.refund(order._id, order.products);
		if (order.integration && order.integration > 0) {
			const balance: CreateUserBalanceDTO = {
				amount: order.integrationAmount,
				user: order.user._id,
				type: 'add',
				sourceId: order._id,
				sourceType: 1,
			};
			await this.userBalanceService.create(balance);
		}
		return await this.handleRefund(order, refund);
	}

	// 根据id查找
	async changeAddress(
		id: string,
		address: CreateAddressDTO,
	): Promise<IOrder | null> {
		return await this.refundModel
			.findByIdAndUpdate(id, address)
			.lean()
			.exec();
	}

	// 发货
	async send(id: string, shipper: CreateShipperDTO, user: string) {
		const refund: IRefund | null = await this.refundModel
			.findById(id)
			.lean()
			.exec();
		if (!refund) {
			throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 406);
		}
		if (String(refund.user) !== String(user)) {
			throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403);
		}
		if (!refund) {
			throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 406);
		}
		if (refund.checkResult !== 2) {
			throw new ApiException('订单有误', ApiErrorCode.NO_PERMISSION, 403);
		}
		await this.shipperService.create(shipper, id);
		await this.refundModel.findByIdAndUpdate(id, {
			sendTime: Date.now(),
			checkResult: 3,
		});
		return true;
	}

	// 拒绝
	async refuse(id: string, refuse: RefuseDTO): Promise<IRefund | null> {
		const refund = await this.refundModel
			.findById(id)
			.lean()
			.exec();
		if (!refund) {
			throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 404);
		}
		if (refund.checkResult !== 1) {
			throw new ApiException('订单有误', ApiErrorCode.NO_PERMISSION, 403);
		}
		const order = await this.orderService.findById(refund.order);
		if (!order) {
			throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 404);
		}
		refund.products.map(product => {
			const orderProduct = order.products.find(
				o => String(o.product) === String(product.product),
			);
			if (!orderProduct) {
				throw new ApiException('产品不存在', ApiErrorCode.NO_EXIST, 404);
			}
			orderProduct.refundCount -= product.count;
		});
		await this.orderService.updateProduct(order._id, order.products);
		return await this.refundModel.findByIdAndUpdate(id, {
			refuseReason: refuse.refuseReason,
			checkResult: 5,
			refuseTime: Date.now(),
		});
	}

	// 列表
	async listByUser(
		pagination: Pagination,
		user: string,
		checkResult?: number,
	): Promise<IList<IRefund>> {
		const condition: any = { user };
		if (checkResult) {
			condition.checkResult = checkResult;
		}
		const list = await this.refundModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ createdAt: -1 })
			.populate({
				path: 'products.product',
				model: 'product',
				populate: {
					path: 'specifications',
					model: 'goodSpecification',
				},
			})
			.populate({ path: 'products.good', model: 'good' })
			.lean()
			.exec();
		const total = await this.refundModel.countDocuments(condition);
		return { list, total };
	}

	// 订单详情
	async detail(id: string, user: string): Promise<IRefund | null> {
		const data = await this.refundModel
			.findById(id)
			.populate({
				path: 'products.product',
				model: 'product',
				populate: {
					path: 'specifications',
					model: 'goodSpecification',
				},
			})
			.populate({ path: 'products.good', model: 'good' })
			.lean()
			.exec();
		if (!data) {
			throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 404);
		}
		if (String(data.user) !== String(user)) {
			throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403);
		}
		return data;
	}

	// 列表
	async list(pagination: Pagination): Promise<IList<IRefund>> {
		const condition = this.paginationUtil.genCondition(
			pagination,
			['refundSn', 'orderSn'],
			'applicationTime',
		);
		const list = await this.refundModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ createdAt: -1 })
			.populate({
				path: 'products.product',
				model: 'product',
				populate: {
					path: 'specifications',
					model: 'goodSpecification',
				},
			})
			.populate({ path: 'products.good', model: 'good' })
			.populate({
				path: 'user',
				model: 'user',
				select: 'avatar nickname _id',
			})
			.populate({ path: 'order', model: 'order' })
			.lean()
			.exec();
		const total = await this.refundModel.countDocuments(condition);
		return { list, total };
	}

	// 根据id查找
	async getRecord(id: string): Promise<IRefund | null> {
		return await this.refundModel
			.findById(id)
			.populate({
				path: 'products.product',
				model: 'product',
				populate: {
					path: 'specifications',
					model: 'goodSpecification',
				},
			})
			.populate({ path: 'products.good', model: 'good' })
			.populate({
				path: 'user',
				model: 'user',
				select: 'avatar nickname _id',
			})
			.lean()
			.exec();
	}

	// 根据id查找
	async refund(id: string) {
		const refund: IRefund | null = await this.refundModel
			.findById(id)
			.populate({ path: 'order', model: 'order' })
			.populate({
				path: 'user',
				model: 'user',
				select: 'avatar nickname _id weixinOpenid',
			})
			.lean()
			.exec();
		if (!refund) {
			throw new ApiException('订单不存在', ApiErrorCode.NO_EXIST, 404);
		}

		if (refund.order.isRefund) {
			await this.orderService.updateCheckResult(refund.order._id, 5);
		}
		return await this.handleRefund(refund.order, refund);
	}

	// 处理退款
	async handleRefund(order: IOrder, refund: IRefund) {
		let refundId = '';
		if (order.payType === 2) {
			const balance: CreateUserBalanceDTO = {
				amount: order.actualPrice,
				type: 'add',
				sourceId: order._id,
				sourceType: 3,
				user: order.user,
			};
			await this.userBalanceService.create(balance);
		} else {
			const result: any = await this.weixinUtil.refund(
				refund.refundPrice,
				order.paySn,
				refund._id,
			);
			if (!result) {
				throw new ApiException('退款失败', ApiErrorCode.NO_EXIST, 406);
			}
			refundId = result.refund_id;
		}
		return await this.refundModel.findByIdAndUpdate(refund._id, {
			checkResult: 4,
			refundTime: Date.now(),
			refundId,
			refundType: order.payType,
		});
	}
}
