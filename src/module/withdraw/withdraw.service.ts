import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { IWithdraw } from './withdraw.interfaces';
import { IUser } from '../user/user.interfaces';
import { CreateUserBalanceDTO } from '../userBalance/userBalance.dto';
import { UserBalanceService } from '../userBalance/userBalance.service';

@Injectable()
export class WithdrawService {
	constructor(
		@Inject('WithdrawModelToken')
		private readonly withdrawModel: Model<IWithdraw>,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
		@Inject(UserBalanceService)
		private readonly userBalanceService: UserBalanceService,
	) {}

	// 创建数据
	async create(amount: number, user: IUser): Promise<string> {
		if (user.balance < 100 || amount > user.balance) {
			throw new ApiException('余额不足', ApiErrorCode.INPUT_ERROR, 406);
		}
		const withdraw: IWithdraw = await this.withdrawModel.create({
			user: user._id,
			amount: Number(amount.toFixed(2)),
			checkResult: 1,
		});
		const balance: CreateUserBalanceDTO = {
			amount: Number(amount.toFixed(2)),
			user: user._id,
			type: 'minus',
			sourceId: withdraw._id,
			sourceType: 3,
		};
		await this.userBalanceService.create(balance);
		return 'success';
	}

	// 分页查询数据
	async list(pagination: Pagination): Promise<IList<IWithdraw>> {
		const condition = this.paginationUtil.genCondition(
			pagination,
			[],
			'createdAt',
		);
		const list = await this.withdrawModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ createdAt: -1 })
			.populate({ path: 'user', model: 'user', select: '_id nickname avatar' })
			.populate({ path: 'reviewer', model: 'admin', select: '_id nickname' })
			.lean();
		const total = await this.withdrawModel.countDocuments(condition);
		return { list, total };
	}

	// 用户分页查询数据
	async listByUser(
		pagination: Pagination,
		user: string,
	): Promise<IList<IWithdraw>> {
		const condition = { user };
		const list = await this.withdrawModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ createdAt: -1 })
			.populate({ path: 'reviewer', model: 'admin', select: '_id nickname' })
			.lean();
		const total = await this.withdrawModel.countDocuments(condition);
		return { list, total };
	}

	// 提现成功
	async accept(id: string, reviewer: string): Promise<string> {
		const withdraw: IWithdraw | null = await this.withdrawModel.findById(id);
		if (!withdraw) {
			throw new ApiException('提现申请不存在', ApiErrorCode.NO_EXIST, 404);
		}
		if (withdraw.checkResult !== 1) {
			throw new ApiException('提现申请已处理', ApiErrorCode.NO_EXIST, 404);
		}
		await this.withdrawModel.findById(id, {
			checkResult: 2,
			reviewer,
			reviewTime: Date.now(),
		});
		return 'success';
	}
	// 拒绝提现
	async reject(id: string, reviewer: string): Promise<string> {
		const withdraw: IWithdraw | null = await this.withdrawModel.findById(id);
		if (!withdraw) {
			throw new ApiException('提现申请不存在', ApiErrorCode.NO_EXIST, 404);
		}
		if (withdraw.checkResult !== 1) {
			throw new ApiException('提现申请已处理', ApiErrorCode.NO_EXIST, 404);
		}
		const balance: CreateUserBalanceDTO = {
			amount: withdraw.amount,
			user: withdraw.user,
			type: 'add',
			sourceId: withdraw._id,
			sourceType: 3,
		};
		await this.userBalanceService.create(balance);
		await this.withdrawModel.findById(id, {
			checkResult: 2,
			reviewer,
			reviewTime: Date.now(),
		});
		return 'success';
	}
}
