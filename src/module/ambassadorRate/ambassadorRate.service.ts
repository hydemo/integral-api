import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { CreateAmbassadorRateDTO } from './ambassadorRate.dto';
import { IAmbassadorRate } from './ambassadorRate.interfaces';

@Injectable()
export class AmbassadorRateService {
	constructor(
		@Inject('AmbassadorRateModelToken')
		private readonly ambassadorRateModel: Model<IAmbassadorRate>,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
	) {}

	// 创建数据
	async create(
		createAmbassadorRateDTO: CreateAmbassadorRateDTO,
		user: string,
	): Promise<IAmbassadorRate> {
		const exist = await this.ambassadorRateModel.findOne({
			type: createAmbassadorRateDTO.type,
			level: createAmbassadorRateDTO.level,
		});
		if (exist) {
			throw new ApiException('分发比例已存在', ApiErrorCode.EXIST, 406);
		}
		return await this.ambassadorRateModel.create({
			...createAmbassadorRateDTO,
			createBy: user,
		});
	}

	// 分页查询数据
	async list(pagination: Pagination): Promise<IList<IAmbassadorRate>> {
		const condition = this.paginationUtil.genCondition(pagination, []);
		const list = await this.ambassadorRateModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.populate({
				path: 'createBy',
				model: 'admin',
				select: '_id avatar nickname',
			})
			.sort({ createdAt: -1 })
			.lean();
		const total = await this.ambassadorRateModel.countDocuments(condition);
		return { list, total };
	}

	// 修改数据
	async update(
		id: string,
		createAmbassadorRateDTO: CreateAmbassadorRateDTO,
	): Promise<IAmbassadorRate | null> {
		const exist = await this.ambassadorRateModel.findOne({
			_id: { $ne: id },
			type: createAmbassadorRateDTO.type,
			level: createAmbassadorRateDTO.level,
		});
		if (exist) {
			throw new ApiException('分发比例已存在', ApiErrorCode.EXIST, 406);
		}
		return await this.ambassadorRateModel.findByIdAndUpdate(
			id,
			createAmbassadorRateDTO,
		);
	}

	// 详情
	async detail(id: string): Promise<IAmbassadorRate> {
		const integrationRate = await this.ambassadorRateModel.findById(id).lean();
		if (!integrationRate) {
			throw new ApiException('数据不存在', ApiErrorCode.NO_EXIST, 404);
		}
		return integrationRate;
	}

	// 软删除
	async remove(id: string) {
		return await this.ambassadorRateModel.findByIdAndDelete(id);
	}

	// 恢复
	async getRate(level: number) {
		const result: any = {};
		const list: IAmbassadorRate[] = await this.ambassadorRateModel
			.find({ isDelete: false, level })
			.lean();
		list.map(li => {
			result[li.type] = li.rate;
			return null;
		});
		return result;
	}
}
