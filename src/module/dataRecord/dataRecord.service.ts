import { Model } from 'mongoose';
import * as moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { CreateDataRecordDTO } from './dataRecord.dto';
import { IDataRecord } from './dataRecord.interfaces';
import { RedisService } from 'nestjs-redis';
import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';
import { GoodService } from '../good/good.service';
import { OrderService } from '../order/order.service';
import { UserRecordService } from '../userRecord/userRecord.service';
import { GoodRecordService } from '../goodRecord/goodRecord.service';
import { CategoryRecordService } from '../categoryRecord/categoryRecord.service';
import { ICategoryRecord } from '../categoryRecord/categoryRecord.interfaces';

@Injectable()
export class DataRecordService {
	constructor(
		@Inject('DataRecordModelToken')
		private readonly dataRecordModel: Model<any>,
		@Inject(UserService) private readonly userService: UserService,
		@Inject(CategoryService) private readonly categoryService: CategoryService,
		@Inject(GoodService) private readonly goodService: GoodService,
		@Inject(OrderService) private readonly orderService: OrderService,
		@Inject(UserRecordService)
		private readonly userRecordService: UserRecordService,
		@Inject(GoodRecordService)
		private readonly goodRecordService: GoodRecordService,
		@Inject(CategoryRecordService)
		private readonly categoryRecordService: CategoryRecordService,
		private readonly redis: RedisService,
	) {}
	// 生成当天数据
	async genLog() {
		const preDate = moment()
			.add(-2, 'd')
			.format('YYYY-MM-DD');
		const preLog: IDataRecord | null = await this.dataRecordModel.findOne({
			day: preDate,
		});
		const client = this.redis.getClient();
		const sale = Number(await client.hget('dataRecord', 'sale'));
		const users = Number(await client.hget('dataRecord', 'users'));
		const viewUsers: string[] = await client.hkeys('viewCount');
		const viewCount = viewUsers.length;
		const buyUsers = Number(await client.hget('dataRecord', 'buyUsers'));
		const categories = Number(await client.hget('dataRecord', 'categories'));
		const goods = Number(await client.hget('dataRecord', 'goods'));
		const orders = Number(await client.hget('dataRecord', 'orders'));

		await client.hset('dataRecord', 'sale', 0);
		await client.hset('dataRecord', 'users', 0);
		await client.hset('dataRecord', 'buyUsers', 0);
		await client.hset('dataRecord', 'categories', 0);
		await client.hset('dataRecord', 'goods', 0);
		await client.hset('dataRecord', 'orders', 0);
		await client.del('viewCount');

		const day = moment()
			.add(-1, 'd')
			.format('YYYY-MM-DD');
		const month = moment()
			.add(-1, 'd')
			.format('YYYY-MM');
		const year = moment()
			.add(-1, 'd')
			.format('YYYY');
		const record: CreateDataRecordDTO = {
			// 日期
			day,
			month,
			year,
			sale,
			users,
			viewCount,
			buyUsers,
			categories,
			goods,
			orders,
			// 总销量
			saleTotal: preLog ? sale + preLog.saleTotal : sale,
			// 总用户数
			buyUsersTotal: preLog ? buyUsers + preLog.buyUsersTotal : buyUsers,
			// 总用户数
			viewCountTotal: preLog ? viewCount + preLog.viewCountTotal : viewCount,
		};
		return await this.dataRecordModel.create(record);
	}

	// 获取当天数据
	async getToday(): Promise<any> {
		const client = this.redis.getClient();
		const sale = Number(await client.hget('dataRecord', 'sale'));
		const users = Number(await client.hget('dataRecord', 'users'));
		const viewUsers: string[] = await client.hkeys('viewCount');
		const viewCount = viewUsers.length;
		const buyUsers = Number(await client.hget('dataRecord', 'buyUsers'));
		const categories = Number(await client.hget('dataRecord', 'categories'));
		const goods = Number(await client.hget('dataRecord', 'goods'));
		const orders = Number(await client.hget('dataRecord', 'orders'));

		const day = moment().format('YYYY-MM-DD');
		const month = moment().format('YYYY-MM');
		const year = moment().format('YYYY');
		const record: any = {
			// 日期
			day,
			month,
			year,
			sale,
			users,
			viewCount,
			buyUsers,
			categories,
			goods,
			orders,
		};
		return record;
	}

	// 获取汇总数据数据
	async getSummary(): Promise<{ record: IDataRecord; list: IDataRecord[] }> {
		const preDate = moment()
			.add(-1, 'd')
			.format('YYYY-MM-DD');
		const preLog: IDataRecord | null = await this.dataRecordModel.findOne({
			day: preDate,
		});
		const data = await this.getToday();
		const usersTotal = await this.userService.countByCondition({});
		const goodsTotal = await this.goodService.countByCondition({
			isDelete: false,
		});
		const categoriesTotal = await this.categoryService.countByCondition({
			isDelete: false,
		});
		const ordersTotal = await this.orderService.countByCondition({
			isDelete: false,
			checkResult: { $gt: 1 },
		});
		const orderToSend = await this.orderService.countByCondition({
			isDelete: false,
			checkResult: 2,
		});
		const orderSended = await this.orderService.countByCondition({
			isDelete: false,
			checkResult: { $in: [3, 4] },
		});
		const record: IDataRecord = {
			...data,
			usersTotal,
			viewCountTotal: preLog
				? data.viewCount + preLog.viewCountTotal
				: data.viewCount,
			// 总用户数
			buyUsersTotal: preLog
				? data.buyUsers + preLog.buyUsersTotal
				: data.buyUsers,
			categoriesTotal,
			goodsTotal,
			// 总销量
			saleTotal: preLog ? data.sale + preLog.saleTotal : data.sale,
			// 总用户数
			ordersTotal,
			orderSended,
			orderToSend,
		};
		const start = moment()
			.add(-30, 'd')
			.format('YYYY-MM-DD');
		const end = moment()
			.add(-1, 'd')
			.format('YYYY-MM-DD');

		const condition = {
			$and: [{ day: { $lte: end } }, { day: { $gte: start } }],
		};
		const list = await this.dataRecordModel
			.find(condition)
			.sort({ day: 1 })
			.lean()
			.exec();
		list.push(record);

		return { record, list };
	}

	// 根据日期区间获取数据
	async getRecordBetween(
		startTime: string,
		endTime: string,
	): Promise<IDataRecord[]> {
		const now = moment().format('YYYY-MM-DD');
		const start = moment(startTime).format('YYYY-MM-DD');
		const end = moment(endTime).format('YYYY-MM-DD');
		let condition: any;
		const data = await this.getToday();
		if (end === now) {
			const preDate = moment()
				.add(-1, 'd')
				.format('YYYY-MM-DD');
			condition = {
				$and: [{ day: { $lte: preDate } }, { day: { $gte: start } }],
			};
			if (start === end) {
				return [data];
			}
		} else {
			condition = { $and: [{ day: { $lte: end } }, { day: { $gte: start } }] };
		}
		const list = await this.dataRecordModel
			.find(condition)
			.sort({ day: 1 })
			.lean()
			.exec();
		if (end >= now) {
			list.push(data);
		}
		return list;
	}

	// 获取销量排行数据
	async getRank(): Promise<any[]> {
		return await this.goodRecordService.getRank();
	}

	// 根据日期区间获取数据
	async getRadar(): Promise<ICategoryRecord[]> {
		return await this.categoryRecordService.getRadar();
	}
}
