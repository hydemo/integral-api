import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { IGood } from './good.interfaces';
import { CreateGoodDTO, UpdateProductDTO } from './good.dto';
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { GoodSpecificationService } from '../goodSpecification/goodSpecification.service';
import { ProductService } from '../product/product.service';
import { CreateProductDTO } from '../product/product.dto';
import { IGoodSpecification } from '../goodSpecification/goodSpecification.interfaces';
import { ApiException } from 'src/common/expection/api.exception';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';
import { CreateGoodSpecificationDTO } from '../goodSpecification/goodSpecification.dto';
import { PaginationUtil } from 'src/utils/pagination.util';
import { RedisService } from 'nestjs-redis';
import { IAdmin } from '../admin/admin.interfaces';

@Injectable()
export class GoodService {
	constructor(
		@Inject('GoodModelToken') private readonly goodModel: Model<IGood>,
		@Inject(GoodSpecificationService)
		private readonly goodSpecificationService: GoodSpecificationService,
		@Inject(ProductService) private readonly productService: ProductService,
		@Inject(PaginationUtil) private readonly paginationUtil: PaginationUtil,
		private readonly redis: RedisService,
	) {}

	// 统计数量
	async countByCondition(condition: any) {
		return await this.goodModel.countDocuments(condition);
	}

	// 创建数据
	async create(good: CreateGoodDTO, creator: IAdmin) {
		if (!good.products.length || !good.goodSpecifications.length) {
			throw new ApiException('规格不能为空', ApiErrorCode.INPUT_ERROR, 406);
		}
		await this.goodModel.updateMany(
			{ sort: { $gte: good.sort } },
			{ $inc: { sort: 1 } },
		);
		const client = this.redis.getClient();
		await client.hincrby('dataRecord', 'goods', 1);
		const newGood = await this.goodModel.create({ ...good });
		if (!good.goodSpecifications || !good.goodSpecifications.length) {
			return;
		}
		const specifications: IGoodSpecification[] = await Promise.all(
			good.goodSpecifications.map(async spe => {
				return await this.goodSpecificationService.create({
					...spe,
					good: newGood._id,
				});
			}),
		);
		await Promise.all(
			good.products.map(async pro => {
				const productSpecifications: string[] = [];
				pro.specifications.map((item, index) => {
					const select = specifications.find(o => o.indicator === item);
					if (!select) {
						throw new ApiException(
							'Error Product',
							ApiErrorCode.INPUT_ERROR,
							406,
						);
					}
					productSpecifications[index] = select._id;
				});
				const newProduct: CreateProductDTO = {
					...pro,
					specifications: productSpecifications,
					good: newGood._id,
				};

				return await this.productService.create(newProduct);
			}),
		);
		return newGood;
	}

	// 列表
	async list(pagination: Pagination): Promise<IList<IGood>> {
		const condition = this.paginationUtil.genCondition(pagination, [
			'name',
			'keyword',
		]);
		const goods: IGood[] = await this.goodModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ sort: 1 })
			.populate({ path: 'creator', model: 'admin', select: '_id nickname' })
			.populate({
				path: 'recommendUser',
				model: 'user',
				select: '_id nickname',
			})
			.lean()
			.exec();
		const list: IGood[] = await Promise.all(
			goods.map(async good => {
				good.products = await this.productService.all({ good: good._id });
				return good;
			}),
		);
		const total = await this.goodModel.countDocuments(condition);
		const max = await this.goodModel.countDocuments({
			isDelete: condition.isDelete ? true : false,
		});
		return { list, total, max };
	}

	// 商品列表
	async listByUser(
		pagination: Pagination,
		condition: any,
	): Promise<IList<IGood>> {
		const newCondition = {
			...condition,
			isDelete: false,
			onSale: true,
			checkResult: 2,
		};
		const goods: IGood[] = await this.goodModel
			.find(newCondition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ sort: 1, createdAt: -1 })
			.lean()
			.exec();
		const total = await this.goodModel.countDocuments(newCondition);
		const list: IGood[] = await Promise.all(
			goods.map(async good => {
				good.products = await this.productService.all({ good: good._id });
				return good;
			}),
		);
		return { list, total };
	}
	// 删除数据
	async findByIdAndRemove(id: string): Promise<boolean> {
		const goodExist = await this.goodModel
			.findById(id)
			.lean()
			.exec();
		if (!goodExist) {
			throw new ApiException('分类有误', ApiErrorCode.INPUT_ERROR, 406);
		}
		await this.goodModel.findByIdAndUpdate(id, {
			isDelete: true,
			deleteTime: Date.now(),
		});
		await this.goodModel.updateMany(
			{ isDelete: false, sort: { $gte: goodExist.sort } },
			{ $inc: { sort: -1 } },
		);

		return true;
	}
	// 修改数据
	async findByIdAndUpdate(id, good: CreateGoodDTO): Promise<boolean> {
		const goodExist = await this.goodModel
			.findById(id)
			.lean()
			.exec();
		if (!goodExist) {
			throw new ApiException('分类有误', ApiErrorCode.INPUT_ERROR, 406);
		}
		if (good.sort && goodExist.sort !== good.sort) {
			await this.goodModel.updateMany(
				{ sort: { $gt: goodExist.sort } },
				{ $inc: { sort: -1 } },
			);
			await this.goodModel.updateMany(
				{ sort: { $gte: good.sort } },
				{ $inc: { sort: 1 } },
			);
		}
		if (good.isLimit === false) {
			await this.goodModel.findByIdAndUpdate(id, {
				$unset: {
					limitStartTime: 1,
					limitEndTime: 1,
					promotionType: 1,
					promotionValue: 1,
				},
			});
		}
		if (good.preSale === false) {
			await this.goodModel.findByIdAndUpdate(id, {
				$unset: {
					preSaleType: 1,
					preSaleValue: 1,
					preSaleEndTime: 1,
					preSaleSendTime: 1,
				},
			});
		}
		if (!good.recommendUser) {
			good.recommendUser = undefined;
		}
		await this.goodModel.findByIdAndUpdate(id, good);
		return true;
	}

	// 修改数据
	async updateProduct(
		good: string,
		product: UpdateProductDTO,
	): Promise<boolean> {
		const { goodSpecifications, products } = product;
		if (!products.length || !goodSpecifications.length) {
			throw new ApiException('规格不能为空', ApiErrorCode.INPUT_ERROR, 406);
		}
		await this.goodSpecificationService.softDelete({
			good,
			_id: { $nin: goodSpecifications.map(v => v._id).filter(v => v) },
		});
		await this.productService.softDelete({
			good,
			_id: { $nin: products.map(v => v._id).filter(v => v) },
		});

		const specifications: IGoodSpecification[] = await Promise.all(
			goodSpecifications.map(async spe => {
				const newSpe: CreateGoodSpecificationDTO = {
					specification: spe.specification,
					indicator: spe.indicator,
					pic: spe.pic,
					value: spe.value,
				};
				if (spe._id) {
					const data = await this.goodSpecificationService.findByIdAndUpdate(
						spe._id,
						newSpe,
					);
					if (!data) {
						throw new ApiException('Error Spe', ApiErrorCode.INPUT_ERROR, 406);
					}
					return data;
				}
				return await this.goodSpecificationService.create({ ...spe, good });
			}),
		);
		await Promise.all(
			products.map(async pro => {
				const productSpecifications: string[] = [];
				pro.specifications.map((item, index) => {
					const select = specifications.find(o => o.indicator === item);
					if (!select) {
						throw new ApiException(
							'Error Product',
							ApiErrorCode.INPUT_ERROR,
							406,
						);
					}
					productSpecifications[index] = select._id;
				});
				const newProduct: CreateProductDTO = {
					...pro,
					specifications: productSpecifications,
					good,
				};
				if (pro._id) {
					return await this.productService.findByIdAndUpdate(
						pro._id,
						newProduct,
					);
				}
				return await this.productService.create({ ...newProduct, good });
			}),
		);
		return true;
	}

	// 恢复
	async recoverById(id: string) {
		const goodExist = await this.goodModel
			.findById(id)
			.lean()
			.exec();
		if (!goodExist) {
			throw new ApiException('分类有误', ApiErrorCode.INPUT_ERROR, 406);
		}
		await this.goodModel.updateMany(
			{ isDelete: false, sort: { $gte: goodExist.sort } },
			{ $inc: { sort: 1 } },
		);
		await this.goodModel.findByIdAndUpdate(id, {
			isDelete: false,
			$unset: { deleteTime: 1 },
		});
		return;
	}

	// 恢复
	async findById(id: string): Promise<IGood | null> {
		return await this.goodModel
			.findById(id)
			.lean()
			.exec();
	}

	// 增加销量
	async incSellVolumn(id: string, inc: number) {
		return await this.goodModel.findByIdAndUpdate(id, {
			$inc: { sellVolumn: inc },
		});
	}

	// 恢复
	async detail(id: string): Promise<IGood | null> {
		const good = await this.goodModel
			.findById(id)
			.populate({ path: 'creator', model: 'admin', select: '_id nickname' })
			.populate({ path: 'category', model: 'category', select: '_id name' })
			.lean()
			.exec();
		if (!good) {
			throw new ApiException('商品不存在', ApiErrorCode.NO_EXIST, 404);
		}
		const goodSpecifications = await this.goodSpecificationService.all({
			good: good._id,
		});
		const products = await this.productService.all({ good: good._id });
		return { ...good, goodSpecifications, products };
	}

	// 根据id查找
	async findByIdWithProduct(id: string) {
		const good = await this.goodModel
			.findById(id)
			.lean()
			.exec();
		if (!good.onSale) {
			throw new ApiException('商品已下架', ApiErrorCode.NO_EXIST, 404);
		}
		if (good.isDelete) {
			throw new ApiException('商品不存在', ApiErrorCode.NO_EXIST, 404);
		}
		const goodSpecifications: IGoodSpecification[] = await this.goodSpecificationService.all(
			{ good: id },
		);
		const specifications: any = [];
		const specificationOptions = {};
		goodSpecifications.map(item => {
			const index = specifications.findIndex(
				o => o._id === item.specification._id,
			);
			if (index < 0) {
				specificationOptions[item.specification._id] = [item];
				specifications.push(item.specification);
			} else {
				specificationOptions[item.specification._id].push(item);
			}
		});
		const products = await this.productService.findByCondition({ good: id });
		return {
			...good,
			specifications: specifications.sort((pre, next) => pre.sort - next.sort),
			specificationOptions,
			products,
		};
	}

	// 批量操作
	async bulk(type: number, ids: string[]) {
		let update = {};
		switch (type) {
			case 1:
				update = { onSale: true };
				break;
			case 2:
				update = { onSale: false };
				break;
			case 3:
				update = { isHot: true };
				break;
			case 4:
				update = { isHot: false };
				break;

			default:
				break;
		}
		await this.goodModel.updateMany({ _id: { $in: ids } }, update);
		return true;
	}
}
