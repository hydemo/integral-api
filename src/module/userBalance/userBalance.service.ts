import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { IUserBalance } from './userBalance.interfaces';
import { CreateUserBalanceDTO, UserBalanceDTO } from './userBalance.dto';
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { UserService } from '../user/user.service';
import { PaginationUtil } from 'src/utils/pagination.util';
import { ApiException } from 'src/common/expection/api.exception';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';

@Injectable()
export class UserBalanceService {
	constructor(
		@Inject('UserBalanceModelToken')
		private readonly userBalanceModel: Model<IUserBalance>,
		@Inject(UserService) private readonly userService: UserService,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
	) {}

	// 创建数据
	async create(
		userBalance: CreateUserBalanceDTO,
	): Promise<IUserBalance | null> {
		const amount = Number(userBalance.amount.toFixed(2));
		if (amount <= 0) {
			return null;
		}
		if (userBalance.type === 'add') {
			await this.userService.incBalance(userBalance.user, amount);
		} else {
			await this.userService.incBalance(userBalance.user, -amount);
		}
		return await this.userBalanceModel.create({ ...userBalance, amount });
	}

	// 列表
	async list(pagination: Pagination): Promise<IList<IUserBalance>> {
		const condition = this.paginationUtil.genCondition(pagination, ['amount']);
		const list = await this.userBalanceModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.populate({ path: 'user', model: 'user', select: 'avatar nickname _id' })
			.sort({ createdAt: -1 })
			.lean()
			.exec();
		const total = await this.userBalanceModel.countDocuments(condition);
		return { list, total };
	}

	// 列表
	async listByUser(
		pagination: Pagination,
		user: string,
	): Promise<IList<IUserBalance>> {
		const condition = { user };
		const list = await this.userBalanceModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.lean()
			.exec();
		const total = await this.userBalanceModel.countDocuments(condition);
		return { list, total };
	}

	async update(id: string, balance: UserBalanceDTO) {
		const user = await this.userService.findById(id);
		if (!user) {
			throw new ApiException('用户不存在', ApiErrorCode.NO_EXIST, 404);
		}
		let amount = Number((balance.balance - user.balance).toFixed(2));
		let type = 'add';
		if (balance.balance < user.balance) {
			amount = Number((user.balance - balance.balance).toFixed(2));
			type = 'minus';
		}
		const newBalance: CreateUserBalanceDTO = {
			user: id,
			amount,
			type,
			sourceType: 4,
		};
		await this.userBalanceModel.create(newBalance);
		await this.userService.updateById(id, balance);
	}
}
