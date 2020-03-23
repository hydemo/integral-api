import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { CreateIntegrationRateDTO } from './integrationRate.dto';
import { IIntegrationRate } from './integrationRate.interfaces';

@Injectable()
export class IntegrationRateService {
	constructor(
		@Inject('IntegrationRateModelToken')
		private readonly integrationRateModel: Model<IIntegrationRate>,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
	) {}

	// 创建数据
	async create(
		createIntegrationRateDTO: CreateIntegrationRateDTO,
		user: string,
	): Promise<IIntegrationRate> {
		const exist = await this.integrationRateModel.findOne({
			type: createIntegrationRateDTO.type,
		});
		if (exist) {
			throw new ApiException('分发比例已存在', ApiErrorCode.EXIST, 406);
		}
		return await this.integrationRateModel.create({
			...createIntegrationRateDTO,
			createBy: user,
		});
	}

	// 分页查询数据
	async list(pagination: Pagination): Promise<IList<IIntegrationRate>> {
		const condition = this.paginationUtil.genCondition(pagination, []);
		const list = await this.integrationRateModel
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
		const total = await this.integrationRateModel.countDocuments(condition);
		return { list, total };
	}

	// 修改数据
	async update(
		id: string,
		createIntegrationRateDTO: CreateIntegrationRateDTO,
	): Promise<IIntegrationRate | null> {
		const exist = await this.integrationRateModel.findOne({
			_id: { $ne: id },
			type: createIntegrationRateDTO.type,
		});
		if (exist) {
			throw new ApiException('分发比例已存在', ApiErrorCode.EXIST, 406);
		}
		return await this.integrationRateModel.findByIdAndUpdate(
			id,
			createIntegrationRateDTO,
		);
	}

	// 详情
	async detail(id: string): Promise<IIntegrationRate> {
		const integrationRate = await this.integrationRateModel.findById(id).lean();
		if (!integrationRate) {
			throw new ApiException('数据不存在', ApiErrorCode.NO_EXIST, 404);
		}
		return integrationRate;
	}

	// 软删除
	async remove(id: string) {
		return await this.integrationRateModel.findByIdAndDelete(id);
	}

	// 恢复
	async getRate() {
		const result: any = {};
		const list: IIntegrationRate[] = await this.integrationRateModel
			.find({})
			.lean();
		list.map(li => {
			result[li.type] = li.rate;
			if (li.vipRate) {
				result[`vip_${li.type}`] = li.rate;
			}
			return null;
		});
		return result;
	}
}
