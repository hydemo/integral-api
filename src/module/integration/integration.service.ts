import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { CreateIntegrationDTO } from './integration.dto';
import { IIntegration } from './integration.interfaces';
import { UserService } from '../user/user.service';
import { IntegrationSummaryService } from '../integrationSummary/integrationSummary.service';
import { IntegrationRateService } from '../integrationRate/integrationRate.service';
import { ServiceFeeService } from '../serviceFee/serviceFee.service';
import * as moment from 'moment';
import { CreateServiceFeeDTO } from '../serviceFee/serviceFee.dto';

@Injectable()
export class IntegrationService {
	constructor(
		@Inject('IntegrationModelToken')
		private readonly integrationModel: Model<IIntegration>,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
		@Inject(UserService) private readonly userService: UserService,
		@Inject(IntegrationSummaryService)
		private readonly integrationSummaryService: IntegrationSummaryService,
		@Inject(IntegrationRateService)
		private readonly integrationRateService: IntegrationRateService,
		@Inject(ServiceFeeService)
		private readonly serviceFeeService: ServiceFeeService,
	) {}

	// 创建数据
	async create(
		integration: CreateIntegrationDTO,
	): Promise<IIntegration | null> {
		if (integration.count < 0) {
			throw new ApiException('参数有误', ApiErrorCode.INPUT_ERROR, 406);
		}
		const count = Number(integration.count.toFixed(3));
		if (!count || count <= 0) {
			return null;
		}
		if (integration.type === 'add') {
			if (integration.user) {
				await this.userService.incIntegration(integration.user, count);
			}
			await this.integrationSummaryService.updatePool(
				integration.amount,
				integration.count,
			);
		} else {
			if (integration.user) {
				await this.userService.incIntegration(integration.user, -count);
			}
			await this.integrationSummaryService.updatePool(
				-integration.amount,
				-integration.count,
			);
		}
		return await this.integrationModel.create({ ...integration, count });
	}

	// 分页查询数据
	async list(pagination: Pagination): Promise<IList<IIntegration>> {
		const condition = this.paginationUtil.genCondition(pagination, []);
		const list = await this.integrationModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ createdAt: -1 })
			.lean()
			.exec();
		const total = await this.integrationModel.countDocuments(condition);
		return { list, total };
	}

	// 赠送积分
	async giveIntegration(user: string, address: string, integration: number) {
		if (integration < 0) {
			throw new ApiException('参数有误', ApiErrorCode.INPUT_ERROR, 406);
		}
		const addressUser = await this.userService.findByIntegrationAddress(
			address,
		);
		const integrationRate = await this.integrationRateService.getRate();
		const {
			integrationPrice,
		} = await this.integrationSummaryService.findOneByDate(
			moment().format('YYYY-MM-DD'),
		);
		let getCount = integration;
		let sourceId: string = '';
		if (integrationRate[6]) {
			const serviceCount = Number(
				((integration * integrationRate[6]) / 100).toFixed(3),
			);
			getCount -= serviceCount;
			const serviceAmount = Number(
				(serviceCount * integrationPrice).toFixed(2),
			);
			const serviceFeeDTO: CreateServiceFeeDTO = {
				totalFee: serviceAmount,
				minusFee: 0,
				bondType: 2,
			};
			const newServiceFee = await this.serviceFeeService.create(serviceFeeDTO);
			sourceId = newServiceFee._id;
			await this.integrationSummaryService.updatePool(
				-serviceAmount,
				-serviceCount,
			);
		}

		const giveIntegration: CreateIntegrationDTO = {
			user,
			count: Number(integration.toFixed(3)),
			type: 'minus',
			sourceType: 10,
			amount: Number((integration * integrationPrice).toFixed(2)),
		};
		if (sourceId) {
			giveIntegration.sourceId = sourceId;
		}
		await this.integrationModel.create(giveIntegration);

		const getIntegration: CreateIntegrationDTO = {
			user: addressUser._id,
			count: Number(getCount.toFixed(3)),
			type: 'add',
			sourceType: 10,
			amount: Number((getCount * integrationPrice).toFixed(2)),
		};
		if (sourceId) {
			getIntegration.sourceId = sourceId;
		}
		await this.integrationModel.create(getIntegration);
	}

	// 创建数据
	async updateAmount(amount: number) {
		if (amount < 0) {
			throw new ApiException('参数有误', ApiErrorCode.INPUT_ERROR, 406);
		}

		const changeAmount = await this.integrationSummaryService.updateAmount(
			amount,
		);

		if (changeAmount === 0) {
			return;
		}
		if (!changeAmount) {
			throw new ApiException('参数有误', ApiErrorCode.INPUT_ERROR, 406);
		}
		const newIntegration: CreateIntegrationDTO = {
			count: 0,
			type: changeAmount > 0 ? 'add' : 'minus',
			sourceType: 8,
			amount: Number(changeAmount.toFixed(2)),
		};
		return await this.integrationModel.create(newIntegration);
	}
}
