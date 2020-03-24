import { Model } from 'mongoose';
import * as XLSX from 'xlsx';
import * as uuid from 'uuid/v4';
import * as fs from 'fs';
import * as moment from 'moment';
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
		const condition = this.paginationUtil.genCondition(
			pagination,
			[],
			'createdAt',
		);
		const list = await this.serviceFeeModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ createdAt: -1 })
			.lean();
		const total = await this.serviceFeeModel.countDocuments(condition);
		return { list, total };
	}

	// 下载数据
	async download(start: string, end: string) {
		const condition: any = {};
		if (start) {
			condition.createdAt = {};
			condition.createdAt[`$gte`] = start;
			condition.createdAt[`$lte`] = end;
		}
		const path = `temp/excel`;
		const filename = `${uuid()}.xlsx`;
		const pathExist = fs.existsSync(path);
		if (!pathExist) {
			fs.mkdirSync(path);
		}
		const serviceFees: IServiceFee[] = await this.serviceFeeModel
			.find(condition)
			.sort({ createdAt: -1 })
			.lean()
			.exec();
		const data: any = [];
		const reason = ['订单', '积分赠送'];
		let totalSum = 0;
		let minusSum = 0;
		let assignSum = 0;
		for (const serviceFee of serviceFees) {
			const {
				totalFee = 0,
				minusFee = 0,
				bondType = 1,
				createdAt,
			} = serviceFee;
			totalSum += totalFee;
			minusSum += minusFee;
			assignSum += totalFee - minusFee;
			const serviceFeeData = {
				来源: reason[bondType - 1],
				总服务费: totalFee.toFixed(2),
				分发金额: minusFee.toFixed(2),
				用户所得: (totalFee - minusFee).toFixed(2),
				生成时间: moment(createdAt).format('YYYY-MM-DD HH:mm:ss'),
			};
			data.push(serviceFeeData);
		}
		data.push({
			来源: '汇总',
			总服务费: totalSum.toFixed(2),
			分发金额: minusSum.toFixed(2),
			用户所得: assignSum.toFixed(2),
			生成时间: moment().format('YYYY-MM-DD HH:mm:ss'),
		});
		const wch: any = [];
		for (let w = 0; w < 7; w++) {
			wch.push({ wch: 25 });
		}

		const sheet = XLSX.utils.json_to_sheet(data);
		sheet['!cols'] = wch;
		const workbook = {
			SheetNames: ['服务费汇总表'],
			Sheets: { 服务费汇总表: sheet },
		};
		XLSX.writeFile(workbook, `${path}/${filename}`);
		return filename;
	}
}
