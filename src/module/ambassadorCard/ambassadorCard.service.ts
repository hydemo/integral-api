import { Model } from 'mongoose';
import * as uuid from 'uuid/v4';
import { Inject, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import {
	CreateAmbassadorCardDTO,
	AmbassadorCardDTO,
} from './ambassadorCard.dto';
import { IAmbassadorCard } from './ambassadorCard.interfaces';
import { UserService } from '../user/user.service';

@Injectable()
export class AmbassadorCardService {
	constructor(
		@Inject('AmbassadorCardModelToken')
		private readonly ambassadorCardModel: Model<IAmbassadorCard>,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
		@Inject(UserService) private readonly userService: UserService,
	) {}

	// 创建数据
	async create(
		card: CreateAmbassadorCardDTO,
		createBy: string,
	): Promise<boolean> {
		let count = 1;
		if (card.count) {
			count = card.count;
		}
		for (let i = 0; i < count; i++) {
			await this.ambassadorCardModel.create({ ...card, createBy, key: uuid() });
		}
		return true;
	}

	// 列表
	async list(pagination: Pagination): Promise<IList<IAmbassadorCard>> {
		const condition = this.paginationUtil.genCondition(pagination, ['key']);
		const list = await this.ambassadorCardModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.populate({ path: 'useBy', model: 'user', select: '_id nickname avatar' })
			.sort({ createdAt: -1 })
			.lean()
			.exec();
		const total = await this.ambassadorCardModel.countDocuments(condition);
		return { list, total };
	}
	// 删除数据
	async findByIdAndRemove(id: string): Promise<boolean> {
		await this.ambassadorCardModel.findByIdAndUpdate(id, {
			isDelete: true,
			deleteTime: Date.now(),
		});
		return true;
	}
	// 修改数据
	async findByIdAndUpdate(id, card: CreateAmbassadorCardDTO): Promise<boolean> {
		await this.ambassadorCardModel.findByIdAndUpdate(id, card);
		return true;
	}
	// 恢复
	async recoverById(id: string) {
		await this.ambassadorCardModel.findByIdAndUpdate(id, {
			isDelete: false,
			$unset: { deleteTime: 1 },
		});
		return;
	}

	async useAmbassadorCard(ambassadorCard: AmbassadorCardDTO, user: string) {
		const card: IAmbassadorCard | null = await this.ambassadorCardModel.findOne(
			{
				key: ambassadorCard.key,
				isDelete: false,
			},
		);
		if (!card) {
			throw new ApiException('大使码有误', ApiErrorCode.NO_EXIST, 406);
		}
		if (card.isUsed) {
			throw new ApiException('大使码已被使用', ApiErrorCode.INPUT_ERROR, 406);
		}
		await this.userService.changeAmbassadorLevel(user, card.level);
		await this.ambassadorCardModel.findByIdAndUpdate(card._id, {
			isUsed: true,
			useBy: user,
			useTime: Date.now(),
		});
		return 'success';
	}
}
