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
import { CreateUserBalanceDTO } from '../userBalance/userBalance.dto';
import { UserBalanceService } from '../userBalance/userBalance.service';
import { IUser } from '../user/user.interfaces';

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
		@Inject(UserBalanceService)
		private readonly userBalanceService: UserBalanceService,
	) {}

	// 创建数据
	async create(
		integration: CreateIntegrationDTO,
	): Promise<IIntegration | null> {
		if (integration.count < 0) {
			throw new ApiException('参数有误', ApiErrorCode.INPUT_ERROR, 406);
		}
		const count = Number(integration.count.toFixed(3));
		if (!integration.amount && !count) {
			return null;
		}
		if (integration.type === 'add') {
			if (integration.user) {
				await this.userService.incIntegration(integration.user, count);
			}
			await this.integrationSummaryService.updateIntegration(
				integration.amount,
				integration.count,
			);
		} else {
			if (integration.user) {
				await this.userService.incIntegration(integration.user, -count);
			}
			await this.integrationSummaryService.updateIntegration(
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
			.populate({ path: 'user', model: 'user', select: '_id nickname' })
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ createdAt: -1 })
			.lean()
			.exec();
		const total = await this.integrationModel.countDocuments(condition);
		return { list, total };
	}

	// 分页查询数据
	async fetchByBond(sourceId: string): Promise<IIntegration[]> {
		return await this.integrationModel
			.find({ sourceId })
			.populate({ path: 'user', model: 'user', select: '_id nickname ' })
			.sort({ createdAt: -1 })
			.lean()
			.exec();
	}

	// 分页查询数据
	async listByUser(
		pagination: Pagination,
		user: string,
		sourceType?: number,
	): Promise<IList<IIntegration>> {
		const condition = this.paginationUtil.genCondition(pagination, []);
		condition.user = user;
		if (sourceType) {
			condition.sourceType = sourceType;
		}
		const list = await this.integrationModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ createdAt: -1 })
			.populate({
				path: 'sourceUser',
				model: 'user',
				select: '_id nickname',
			})
			.populate({
				path: 'good',
				model: 'good',
			})
			.lean()
			.exec();
		const total = await this.integrationModel.countDocuments(condition);
		return { list, total };
	}

	async invites(pagination: Pagination, user: string) {
		const invites = await this.userService.list(pagination, user);
		const list = await Promise.all(
			invites.list.map(async invite => {
				const integrations = await this.integrationModel.find({
					sourceUser: invite._id,
					user,
					type: 2,
				});
				let amount = 0;
				let integration = 0;
				integrations.map(int => {
					(amount += int.amount), (integration += int.count);
				});
				return {
					_id: invite._id,
					avatar: invite.avatar,
					nickname: invite.nickname,
					amount: amount.toFixed(2),
					integration: integration.toFixed(2),
				};
			}),
		);
		return { list, total: invites.total };
	}

	// 赠送积分
	async giveIntegration(user: IUser, address: string, integration: number) {
		if (integration < 0) {
			throw new ApiException('参数有误', ApiErrorCode.INPUT_ERROR, 406);
		}
		if (user.integration < integration) {
			throw new ApiException('积分不足', ApiErrorCode.INPUT_ERROR, 406);
		}
		const addressUser = await this.userService.findByIntegrationAddress(
			address,
		);
		if (String(addressUser._id) === String(user._id)) {
			throw new ApiException(
				'请勿给自己赠送积分',
				ApiErrorCode.INPUT_ERROR,
				406,
			);
		}
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
			await this.integrationSummaryService.updateIntegration(
				-serviceAmount,
				-serviceCount,
			);
		}

		const giveIntegration: CreateIntegrationDTO = {
			user: user._id,
			count: Number(integration.toFixed(3)),
			type: 'minus',
			sourceType: 9,
			amount: Number((integration * integrationPrice).toFixed(2)),
		};
		if (sourceId) {
			giveIntegration.sourceId = sourceId;
		}
		await this.integrationModel.create(giveIntegration);
		await this.userService.incIntegration(user._id, -integration);

		const getIntegration: CreateIntegrationDTO = {
			user: addressUser._id,
			count: Number(getCount.toFixed(3)),
			type: 'add',
			sourceType: 9,
			amount: Number((getCount * integrationPrice).toFixed(2)),
		};
		if (sourceId) {
			getIntegration.sourceId = sourceId;
		}
		await this.integrationModel.create(getIntegration);
		await this.userService.incIntegration(addressUser._id, getCount);
	}

	// 赠送积分
	async exchange(user: IUser, count: number) {
		if (!count || count < 0) {
			throw new ApiException('参数有误', ApiErrorCode.INPUT_ERROR, 406);
		}
		if (count > user.integration) {
			throw new ApiException('积分不足', ApiErrorCode.INPUT_ERROR, 406);
		}
		const {
			integrationPrice,
		} = await this.integrationSummaryService.findOneByDate(
			moment().format('YYYY-MM-DD'),
		);
		const amount = Number((count * integrationPrice).toFixed(2));
		const newIntegration: CreateIntegrationDTO = {
			user: user._id,
			count: Number(count.toFixed(3)),
			type: 'minus',
			sourceType: 7,
			amount,
		};
		const createIntegration: IIntegration = await this.integrationModel.create(
			newIntegration,
		);
		await this.userService.incIntegration(user._id, -count);

		const balance: CreateUserBalanceDTO = {
			amount,
			user: user._id,
			type: 'add',
			sourceId: createIntegration._id,
			sourceType: 2,
		};
		await this.userBalanceService.create(balance);
		return;
	}

	// 修改积分
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
			amount:
				changeAmount > 0
					? Number(changeAmount.toFixed(2))
					: -Number(changeAmount.toFixed(2)),
		};
		return await this.integrationModel.create(newIntegration);
	}
}
