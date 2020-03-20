import { Model } from 'mongoose';
import * as uuid from 'uuid/v4';
import { Inject, Injectable } from '@nestjs/common';
import { IVipCard } from './vipCard.interfaces';
import { CreateVipCardDTO } from './vipCard.dto';
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { VipCardDTO } from '../user/users.dto';
import { ApiException } from 'src/common/expection/api.exception';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';
import { PaginationUtil } from 'src/utils/pagination.util';
import { UserService } from '../user/user.service';

@Injectable()
export class VipCardService {
	constructor(
		@Inject('VipCardModelToken') private readonly vipCardModel: Model<IVipCard>,
		@Inject(UserService) private readonly userService: UserService,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
	) {}

	// 创建数据
	async create(vipCard: CreateVipCardDTO, creator: string): Promise<boolean> {
		let count = 1;
		if (vipCard.count) {
			count = vipCard.count;
		}
		for (let i = 0; i < count; i++) {
			await this.vipCardModel.create({ ...vipCard, creator, key: uuid() });
		}
		return true;
	}

	// 列表
	async list(pagination: Pagination): Promise<IList<IVipCard>> {
		const condition = this.paginationUtil.genCondition(pagination, ['key']);
		const list = await this.vipCardModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.populate({ path: 'useBy', model: 'user', select: '_id nickname avatar' })
			.sort({ createdAt: -1 })
			.lean()
			.exec();
		const total = await this.vipCardModel.countDocuments(condition);
		return { list, total };
	}
	// 删除数据
	async findByIdAndRemove(id: string): Promise<boolean> {
		await this.vipCardModel.findByIdAndUpdate(id, {
			isDelete: true,
			deleteTime: Date.now(),
		});
		return true;
	}
	// 修改数据
	async findByIdAndUpdate(id, vipCard: CreateVipCardDTO): Promise<boolean> {
		await this.vipCardModel.findByIdAndUpdate(id, vipCard);
		return true;
	}
	// 恢复
	async recoverById(id: string) {
		await this.vipCardModel.findByIdAndUpdate(id, {
			isDelete: false,
			$unset: { deleteTime: 1 },
		});
		return;
	}

	async useVipCard(vipCard: VipCardDTO, user: string) {
		const card: IVipCard | null = await this.vipCardModel.findOne({
			key: vipCard.key,
			isDelete: false,
		});
		if (!card) {
			throw new ApiException('会员卡有误', ApiErrorCode.NO_EXIST, 406);
		}
		if (card.isUsed) {
			throw new ApiException('会员卡已被使用', ApiErrorCode.INPUT_ERROR, 406);
		}
		await this.userService.changeVip(user);
		await this.vipCardModel.findByIdAndUpdate(card._id, {
			isUsed: true,
			useBy: user,
			useTime: Date.now(),
		});
		return card.amount.toFixed(2);
	}
}
