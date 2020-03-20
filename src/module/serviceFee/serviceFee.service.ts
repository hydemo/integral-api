import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Pagination } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { IList } from 'src/common/interface/list.interface';
import { CreateServiceFeeDTO } from './serviceFee.dto';
import { IServiceFee } from './serviceFee.interfaces';

@Injectable()
export class ServiceFeeService {
	constructor(
		@Inject('ServiceFeeModelToken')
		private readonly serviceFeeModel: Model<IServiceFee>,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
	) {}

	// 创建数据
	async create(createServiceFeeDTO: CreateServiceFeeDTO): Promise<IServiceFee> {
		return await this.serviceFeeModel.create(createServiceFeeDTO);
	}

	// 分页查询数据
	async list(pagination: Pagination): Promise<IList<IServiceFee>> {
		const condition = this.paginationUtil.genCondition(pagination, []);
		const list = await this.serviceFeeModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ createdAt: -1 })
			.lean();
		const total = await this.serviceFeeModel.countDocuments(condition);
		return { list, total };
	}
}
