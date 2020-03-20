import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { IProduct } from './product.interfaces';
import { CreateProductDTO } from './product.dto';
import { ApiException } from 'src/common/expection/api.exception';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { PaginationUtil } from 'src/utils/pagination.util';

@Injectable()
export class ProductService {
	constructor(
		@Inject('ProductModelToken') private readonly productModel: Model<IProduct>,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
	) {}

	// 创建数据
	async create(product: CreateProductDTO): Promise<IProduct> {
		return await this.productModel.create(product);
	}
	// 修改数据
	async findByIdAndUpdate(id: string, product: any): Promise<boolean> {
		await this.productModel.findByIdAndUpdate(id, product);
		return true;
	}

	// 库存变更
	async incStock(id: string, inc: number): Promise<boolean> {
		if (inc < 0) {
			const product = await this.productModel.findById(id);
			if (!product) {
				throw new ApiException('商品不存在', ApiErrorCode.NO_EXIST, 404);
			}
			if (product.stock < inc) {
				throw new ApiException('库存不足', ApiErrorCode.NO_EXIST, 404);
			}
		}
		await this.productModel.findByIdAndUpdate(id, { $inc: { stock: inc } });
		return true;
	}

	// 增加销量
	async incSellVolumn(id: string, inc: number) {
		return await this.productModel.findByIdAndUpdate(id, {
			$inc: { sellVolumn: inc },
		});
	}

	// 修改数据
	async findById(id: string): Promise<IProduct | null> {
		return await this.productModel.findById(id);
	}

	// 全部数据
	async all(condition: any): Promise<IProduct[]> {
		condition.isDelete = false;
		return await this.productModel
			.find(condition)
			.populate({
				path: 'specifications',
				model: 'goodSpecification',
				populate: { path: 'specification', model: 'specification' },
			})
			.lean()
			.exec();
	}

	// 修改数据
	async warn(pagination: Pagination): Promise<IList<IProduct>> {
		const condition = this.paginationUtil.genCondition(pagination, []);
		if (!condition.checkResult) {
			condition.checkResult = { $ne: 0 };
		}
		condition.isDelete = false;
		const list = await this.productModel
			.find({ $where: 'this.stock <= this.stockAlarm' })
			.sort({ stock: -1 })
			.populate({
				path: 'specifications',
				model: 'goodSpecification',
				populate: { path: 'specification', model: 'specification' },
			})
			.populate({ path: 'good', model: 'good' })
			.lean()
			.exec();
		const total = await this.productModel.countDocuments(condition);
		return { list, total };
	}

	// 修改数据
	async softDelete(condition: any): Promise<IProduct | null> {
		return await this.productModel.updateMany(condition, {
			isDelete: true,
			deleteTime: Date.now(),
		});
	}

	// 修改数据
	async findByIdAndDelete(id: string): Promise<IProduct | null> {
		return await this.productModel.findByIdAndUpdate(id, {
			isDelete: true,
			deleteTime: Date.now(),
		});
	}

	// 根据条件查询
	async findByCondition(condition: any): Promise<IProduct[]> {
		condition.isDelete = false;
		return await this.productModel
			.find(condition)
			.lean()
			.exec();
	}
}
