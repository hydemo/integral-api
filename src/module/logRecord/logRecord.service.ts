import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { ILog } from './logRecord.interfaces';
import { CreateLogDTO } from './logRecord.dto';
import { Validator } from 'class-validator';

const eunms = {
	address: {
		module: 'address',
		description: '收货地址',
	},
	admins: {
		module: 'admin',
		description: '管理员',
	},
	carousels: {
		module: 'carousel',
		description: '轮播图',
	},
	categories: {
		module: 'category',
		description: '分类',
	},
	comments: {
		module: 'comment',
		description: '评论',
	},
	coupons: {
		module: 'coupon',
		description: '红包/优惠券',
	},
	feedbacks: {
		module: 'feedback',
		description: '用户反馈',
	},
	goods: {
		module: 'good',
		description: '商品',
	},
	notice: {
		module: 'notice',
		description: '订单提醒',
	},
	orders: {
		module: 'order',
		description: '订单',
	},
	products: {
		module: 'product',
		description: '商品规格',
	},
	vipCards: {
		module: 'vipCard',
		description: '会员卡',
	},
	refunds: {
		module: 'refund',
		description: '退货/退款',
	},
	shipFees: {
		module: 'shipFee',
		description: '物流费用',
	},
	specifications: {
		module: 'specification',
		description: '规格',
	},
	integrationRates: {
		module: 'integrationRate',
		description: '积分分发比例',
	},
	integrationSummarys: {
		module: 'integrationSummary',
		description: '积分汇总',
	},
	withdraws: {
		module: 'withdraw',
		description: '提现',
	},
};
const validator = new Validator();

@Injectable()
export class LogService {
	constructor(
		@Inject('LogModelToken') private readonly logModel: Model<ILog>,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
	) {}

	// 创建数据
	async genLog(
		url: string,
		method: string,
		user: string,
		ip: string,
		id: string,
	): Promise<ILog | null> {
		const urls = url.split('/');
		if (urls.length < 3 || urls[1] !== 'cms') {
			return null;
		}
		const key = urls[2];
		const object = eunms[key];
		// 承兑池修改特殊处理
		if (
			method === 'PUT' &&
			urls.length === 4 &&
			urls[3] === 'amount' &&
			object.module === 'integrationSummary'
		) {
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: object.module,
				description: '修改承兑池金额',
				method,
				interface: url,
			};
			return await this.logModel.create(newLog);
		}

		// 提现特殊处理
		if (
			method === 'PUT' &&
			urls.length === 5 &&
			validator.isMongoId(urls[3]) &&
			urls[4] === 'acccept' &&
			object.module === 'withdraw'
		) {
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: object.module,
				description: '提现申请完成处理',
				method,
				bondToObjectId: urls[3],
				interface: url,
			};
			return await this.logModel.create(newLog);
		}

		if (
			method === 'PUT' &&
			urls.length === 5 &&
			validator.isMongoId(urls[3]) &&
			urls[4] === 'reject' &&
			object.module === 'withdraw'
		) {
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: object.module,
				description: '拒绝提现申请',
				method,
				bondToObjectId: urls[3],
				interface: url,
			};
			return await this.logModel.create(newLog);
		}

		// 评论特殊处理
		if (
			method === 'PUT' &&
			urls.length === 5 &&
			validator.isMongoId(urls[3]) &&
			urls[4] === 'feedback' &&
			object.module === 'comment'
		) {
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: object.module,
				description: `回复${object.description}`,
				method,
				bondToObjectId: urls[3],
				interface: url,
			};
			return await this.logModel.create(newLog);
		}
		// 用户接口处理
		if (
			method === 'PUT' &&
			urls.length === 5 &&
			validator.isMongoId(urls[3]) &&
			urls[2] === 'users'
		) {
			let type: string = '';
			switch (urls[4]) {
				case 'block':
					type = '禁用前台用户';
					break;
				case 'unblock':
					type = '取消禁用前台用户';
					break;
				case 'balance':
					type = '修改前台用户余额';
					break;
				case 'invite':
					type = '修改前台邀请人';
					break;
				case 'balance':
					type = '修改前台推广大使等级';
					break;
				default:
					break;
			}
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: 'user',
				description: type,
				method,
				bondToObjectId: urls[3],
				interface: url,
			};
			return await this.logModel.create(newLog);
		}
		// 退货退款特殊处理
		if (
			method === 'PUT' &&
			urls.length === 5 &&
			validator.isMongoId(urls[3]) &&
			object.module === 'refund'
		) {
			let type: string = '';
			switch (urls[4]) {
				case 'confirm':
					type = '通过退货/退款申请';
					break;
				case 'address':
					type = '修改退货地址';
					break;
				case 'price':
					type = '修改退款价格';
					break;
				case 'refund':
					type = '退款申请完成退款';
					break;
				case 'refuse':
					type = '拒绝退货/退款申请';
					break;
				default:
					break;
			}
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: object.module,
				description: type,
				method,
				bondToObjectId: urls[3],
				interface: url,
			};
			return await this.logModel.create(newLog);
		}
		// 订单特殊处理
		if (
			method === 'PUT' &&
			urls.length === 5 &&
			validator.isMongoId(urls[3]) &&
			object.module === 'order'
		) {
			let type: string = '';
			switch (urls[4]) {
				case 'send':
					type = '订单发货';
					break;
				case 'address':
					type = '修改订单地址';
					break;
				case 'price':
					type = '修改订单价格';
					break;
				case 'refund':
					type = '订单退款';
					break;
				default:
					break;
			}
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: object.module,
				description: type,
				method,
				bondToObjectId: urls[3],
				interface: url,
			};
			return await this.logModel.create(newLog);
		}

		// 商品特殊处理
		if (
			method === 'PUT' &&
			urls.length === 5 &&
			validator.isMongoId(urls[3]) &&
			urls[4] === 'product' &&
			object.module === 'good'
		) {
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: object.module,
				description: `修改商品规格`,
				method,
				bondToObjectId: urls[3],
				interface: url,
			};
			return await this.logModel.create(newLog);
		}

		if (
			method === 'PUT' &&
			urls.length === 4 &&
			urls[3] === 'bulk' &&
			object.module === 'good'
		) {
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: object.module,
				description: `批量操作商品`,
				method,
				interface: url,
			};
			return await this.logModel.create(newLog);
		}

		// 登录特殊处理
		if (method === 'POST' && urls.length === 3 && urls[2] === 'login') {
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: 'login',
				description: `用户登录`,
				method,
				bondToObjectId: user,
				interface: url,
			};
			return await this.logModel.create(newLog);
		}

		// 通用处理
		if (method === 'POST') {
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: object.module,
				description: `新增${object.description}`,
				method,
				bondToObjectId: id,
				interface: url,
			};
			return await this.logModel.create(newLog);
		}

		if (method === 'PUT' && urls.length === 4 && validator.isMongoId(urls[3])) {
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: object.module,
				description: `修改${object.description}`,
				method,
				bondToObjectId: urls[3],
				interface: url,
			};
			return await this.logModel.create(newLog);
		}

		if (
			method === 'PUT' &&
			urls.length === 5 &&
			validator.isMongoId(urls[3]) &&
			urls[4] === 'recover'
		) {
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: object.module,
				description: `恢复${object.description}`,
				method,
				bondToObjectId: urls[3],
				interface: url,
			};
			return await this.logModel.create(newLog);
		}

		if (
			method === 'DELETE' &&
			urls.length === 4 &&
			validator.isMongoId(urls[3])
		) {
			const newLog: CreateLogDTO = {
				user,
				ip,
				module: object.module,
				description: `删除${object.description}`,
				method,
				bondToObjectId: urls[3],
				interface: url,
			};
			return await this.logModel.create(newLog);
		}
		return null;
	}

	// async genCommonLog(enum: any,)

	// 分页查询数据
	async list(pagination: Pagination): Promise<IList<ILog>> {
		const condition = this.paginationUtil.genCondition(
			pagination,
			['interface'],
			'createdAt',
		);
		const list = await this.logModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.populate({ path: 'user', model: 'admin', select: 'nickname' })
			.sort({ createdAt: -1 })
			.lean()
			.exec();
		const total = await this.logModel.countDocuments(condition);
		return { list, total };
	}
}
