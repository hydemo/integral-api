import { Model } from 'mongoose';
import * as moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { CreateIntegrationSummaryDTO } from './integrationSummary.dto';
import { IIntegrationSummary } from './integrationSummary.interfaces';
import { ApiException } from 'src/common/expection/api.exception';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';

@Injectable()
export class IntegrationSummaryService {
	constructor(
		@Inject('IntegrationSummaryModelToken')
		private readonly integrationSummaryModel: Model<IIntegrationSummary>,
	) {}
	async init() {
		const data = await this.integrationSummaryModel.findOne();
		if (!data) {
			const newIntegrationSummary: CreateIntegrationSummaryDTO = {
				date: moment().format('YYYY-MM-DD'),
				amount: 0,
				integration: 0,
				integrationPrice: 0.01,
				integrationToday: 0,
				amountToday: 0,
			};
			await this.integrationSummaryModel.create(newIntegrationSummary);
		}
	}

	// 创建数据
	async create(
		createIntegrationSummaryDTO: CreateIntegrationSummaryDTO,
	): Promise<IIntegrationSummary> {
		return await this.integrationSummaryModel.create(
			createIntegrationSummaryDTO,
		);
	}

	// 汇总数据
	async summary(): Promise<IIntegrationSummary[]> {
		const start = moment()
			.add(-15, 'd')
			.format('YYYY-MM-DD');
		const end = moment().format('YYYY-MM-DD');
		return await this.getRecordBetween(start, end);
	}

	// 根据日期区间获取数据
	async getRecordBetween(
		startTime: string,
		endTime: string,
	): Promise<IIntegrationSummary[]> {
		const start = moment(startTime).format('YYYY-MM-DD');
		const end = moment(endTime).format('YYYY-MM-DD');
		const condition = {
			$and: [{ date: { $lte: end } }, { date: { $gte: start } }],
		};
		return await this.integrationSummaryModel
			.find(condition)
			.sort({ date: 1 })
			.lean()
			.exec();
	}

	// 修改承兑池
	async updateAmount(amount: number): Promise<number> {
		const data = await this.integrationSummaryModel
			.findOne({ date: moment().format('YYYY-MM-DD') })
			.lean();
		if (!data) {
			return 0;
		}
		await this.integrationSummaryModel.findByIdAndUpdate(data._id, { amount });
		return data.amount - amount;
	}

	// 根据条件查找单个数据
	async findOneByDate(date: string): Promise<IIntegrationSummary> {
		const data = await this.integrationSummaryModel.findOne({ date }).lean();
		if (!data) {
			throw new ApiException('无当前积分价格', ApiErrorCode.NO_EXIST, 404);
		}
		return data;
	}

	// 更新积分价格
	async refreshPrice() {
		const data = await this.integrationSummaryModel
			.findOne({ date: moment().format('YYYY-MM-DD') })
			.lean();
		if (!data) {
			throw new ApiException('无当前积分价格', ApiErrorCode.NO_EXIST, 404);
		}
		await this.integrationSummaryModel.findByIdAndUpdate(data._id, {
			integrationPrice: data.integration
				? Number((data.amount / data.integration).toFixed(2))
				: 0.01,
		});
	}

	// 修改承兑池和积分池
	async updatePool(): Promise<IIntegrationSummary | null> {
		const summaryOfToday: IIntegrationSummary | null = await this.integrationSummaryModel
			.findOne({
				date: moment()
					.add(-1)
					.format('YYYY-MM-DD'),
			})
			.lean();
		if (!summaryOfToday) {
			throw new ApiException('系统错误', ApiErrorCode.INTERNAL_ERROR, 500);
		}
		const newAmount = Number(
			(summaryOfToday.amountToday + summaryOfToday.amount).toFixed(2),
		);
		const newIntegration = Number(
			(summaryOfToday.integrationToday + summaryOfToday.integration).toFixed(2),
		);
		const newSummary: CreateIntegrationSummaryDTO = {
			date: moment().format('YYYY-MM-DD'),
			amount: newAmount,
			amountToday: 0,
			integrationToday: 0,
			integration: newIntegration,
			integrationPrice: summaryOfToday.integrationPrice,
		};
		return await this.integrationSummaryModel.create(newSummary);
	}

	// 修改承兑池和积分池
	async updateIntegration(
		amount: number,
		integration: number,
	): Promise<IIntegrationSummary | null> {
		const summaryOfToday: IIntegrationSummary | null = await this.integrationSummaryModel
			.findOne({ date: moment().format('YYYY-MM-DD') })
			.lean();
		if (!summaryOfToday) {
			throw new ApiException('系统错误', ApiErrorCode.INTERNAL_ERROR, 500);
		}
		const newAmount = Number((summaryOfToday.amountToday + amount).toFixed(2));
		const newIntegration = Number(
			(summaryOfToday.integrationToday + integration).toFixed(2),
		);
		return await this.integrationSummaryModel.findByIdAndUpdate(
			summaryOfToday._id,
			{ amountToday: newAmount, integrationToday: newIntegration },
		);
	}
}
