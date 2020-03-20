import { Model } from 'mongoose';
import * as moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { IUserRecord } from './userRecord.interfaces';
import { RedisService } from 'nestjs-redis';
import { CreateUserRecordDTO } from './userRecord.dto';
import { IOrder } from '../order/order.interfaces';

@Injectable()
export class UserRecordService {
	constructor(
		@Inject('UserRecordModelToken')
		private readonly userRecordModel: Model<IUserRecord>,
		private readonly redis: RedisService,
	) {}

	// 根据订单生成记录
	async genRecord(user: string, order: IOrder) {
		const client = this.redis.getClient();
		const exist = await this.userRecordModel.findOne({ user });
		if (!exist) {
			await client.hincrby('dataRecord', 'buyUsers', 1);
		}
		let count = 0;
		await Promise.all(
			order.products.map(async product => {
				count += product.count;
			}),
		);
		const price = order.actualPrice;
		const recordExist = await client.hget('userRecordBuy', String(user));
		if (recordExist) {
			await client.hset(
				'userRecordBuy',
				String(user),
				(Number(recordExist) + price).toFixed(2),
			);
		} else {
			await client.hset('userRecordBuy', String(user), price.toFixed(2));
		}
		await client.hincrby('userRecordCount', String(user), count);
		return;
	}

	// 生成当天数据
	async genLog() {
		const client = this.redis.getClient();
		const users = await client.hkeys('userRecordBuy');
		const day = moment()
			.add(-1, 'd')
			.format('YYYY-MM-DD');
		const month = moment()
			.add(-1, 'd')
			.format('YYYY-MM');
		const year = moment()
			.add(-1, 'd')
			.format('YYYY');
		await Promise.all(
			users.map(async user => {
				const buy = Number(await client.hget('userRecordBuy', user));
				const count = Number(await client.hget('userRecordCount', user));
				const preLog: IUserRecord | null = await this.userRecordModel.findOne({
					newRecord: true,
					user,
				});
				const log: CreateUserRecordDTO = {
					// 日期
					day,
					month,
					year,
					buy,
					// 总购买量
					buyTotal: preLog ? buy + preLog.buyTotal : buy,
					// 购买数
					count,
					// 总购买数
					countTotal: preLog ? count + preLog.count : count,
					user,
				};
				if (preLog) {
					await this.userRecordModel.findByIdAndUpdate(preLog._id, {
						newRecord: false,
					});
				}
				return await this.userRecordModel.create(log);
			}),
		);
		await client.del('userRecordBuy');
		await client.del('userRecordCount');
		return;
	}
}
