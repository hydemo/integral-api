import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ICart } from './cart.interfaces';
import { CreateCartDTO, CountDTO } from './cart.dto';
import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { ApiException } from '@common/expection/api.exception';
import { Pagination } from 'src/common/dto/pagination.dto';
import { IList } from 'src/common/interface/list.interface';
import { ProductService } from '../product/product.service';
import { IProduct } from '../product/product.interfaces';
import { GoodService } from '../good/good.service';
import { IGood } from '../good/good.interfaces';

@Injectable()
export class CartService {
	constructor(
		@Inject('CartModelToken') private readonly cartModel: Model<ICart>,
		@Inject(ProductService) private readonly productServicee: ProductService,
		@Inject(GoodService) private readonly goodService: GoodService,
	) {}

	// 创建数据
	async create(cart: CreateCartDTO, user: string): Promise<ICart | null> {
		const product: IProduct | null = await this.productServicee.findById(
			cart.product,
		);
		if (!product) {
			throw new ApiException('找不到商品', ApiErrorCode.NO_EXIST, 404);
		}
		const good: IGood | null = await this.goodService.findById(product.good);
		if (!good) {
			throw new ApiException('找不到商品', ApiErrorCode.NO_EXIST, 404);
		}

		const exist = await this.cartModel.findOne({ user, product: product._id });

		if (exist) {
			return await this.cartModel.findByIdAndUpdate(exist._id, {
				$inc: { count: cart.count },
			});
		}
		const newCart = {
			// 用户
			user,
			// 商品
			good: product.good,
			// 商品规格
			product: product._id,
			// 商品名
			goodName: good.name,
			// 数量
			count: cart.count,
			// 图片
			imgUrl: product.pic,
		};
		return await this.cartModel.create(newCart);
	}

	// 列表
	async list(pagination: Pagination, user: string): Promise<IList<ICart>> {
		const condition = { user };
		const list = await this.cartModel
			.find(condition)
			.limit(pagination.pageSize)
			.skip((pagination.current - 1) * pagination.pageSize)
			.sort({ createdAt: -1 })
			.populate({
				path: 'product',
				model: 'product',
				populate: {
					path: 'specifications',
					model: 'goodSpecification',
					populate: { path: 'specification', model: 'specification' },
				},
			})
			.populate({ path: 'good', model: 'good' })
			.lean()
			.exec();
		const total = await this.cartModel.countDocuments(condition);
		return { list, total };
	}

	// 数量
	async count(user: string): Promise<number> {
		const condition = { user };
		return await this.cartModel.countDocuments(condition);
	}

	// 根据id查找数据
	async findById(id: string): Promise<ICart | null> {
		return await this.cartModel.findById(id);
	}

	// 删除购物车
	async findByIdAndDelete(id: string, user: string): Promise<ICart | null> {
		const cart = await this.cartModel.findById(id);
		if (cart && String(cart.user) !== String(user)) {
			throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403);
		}
		return await this.cartModel.findByIdAndDelete(id);
	}

	// 增加购物车数量
	async incCount(
		id: string,
		count: CountDTO,
		user: string,
	): Promise<ICart | null> {
		const cart = await this.cartModel.findById(id);
		if (cart && String(cart.user) !== String(user)) {
			throw new ApiException('无权限', ApiErrorCode.NO_PERMISSION, 403);
		}
		return await this.cartModel.findByIdAndUpdate(id, { count: count.count });
	}

	// 清空购物车
	async clean(user: string): Promise<boolean> {
		await this.cartModel.remove({ user });
		return true;
	}

	// 删除多个购物车
	async deleteMany(condition): Promise<boolean> {
		await this.cartModel.remove(condition);
		return true;
	}
}
