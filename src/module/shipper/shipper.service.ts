import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { IShipper } from './shipper.interfaces';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { CreateShipperDTO } from './shipper.dto';
import { KDBirdUtil } from 'src/utils/kdbird.util';

@Injectable()
export class ShipperService {
	constructor(
		@Inject('ShipperModelToken') private readonly shipperModel: Model<IShipper>,
		@Inject(KDBirdUtil) private readonly kdBirdUtil: KDBirdUtil,
	) {}

	// 创建数据
	async create(shipper: CreateShipperDTO, order: string): Promise<IShipper> {
		return await this.shipperModel.create({ ...shipper, order });
	}

	// 查询物流信息
	async traces(order: string) {
		const shipper: IShipper | null = await this.shipperModel
			.findOne({ order })
			.lean()
			.exec();
		if (!shipper) {
			throw new ApiException('订单有误', ApiErrorCode.NO_EXIST, 404);
		}
		if (shipper.isFinish) {
			return shipper.traces;
		}
		const expressInfo = await this.kdBirdUtil.queryExpress(
			shipper.shipperCode,
			shipper.logisticCode,
		);
		if (expressInfo.success) {
			await this.shipperModel.findByIdAndUpdate(shipper._id, {
				isFinish: expressInfo.isFinish,
				traces: expressInfo.traces,
			});
		}
		return expressInfo.traces;
	}
}
