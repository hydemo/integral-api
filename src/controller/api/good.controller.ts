import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UseGuards,
	Inject,
	Request,
	Delete,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
} from '@nestjs/swagger';
import { GoodService } from 'src/module/good/good.service';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { CommentService } from 'src/module/comment/comment.service';
import { CategoryService } from 'src/module/category/category.service';
import { CreateCollectDTO } from 'src/module/collect/collect.dto';
import { CollectService } from 'src/module/collect/collect.service';
import { JwtService } from '@nestjs/jwt';
import { WeixinQrcodeService } from 'src/module/weixinQrcode/weixinQrcode.service';
import { CreateWeixinQrcodeDTO } from 'src/module/weixinQrcode/weixinQrcode.dto';

@ApiUseTags('good')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/goods')
export class ApiGoodController {
	constructor(
		@Inject(GoodService) private goodService: GoodService,
		@Inject(CommentService) private commentService: CommentService,
		@Inject(CategoryService) private categoryService: CategoryService,
		@Inject(CollectService) private collectService: CollectService,
		private readonly jwtService: JwtService,
		@Inject(WeixinQrcodeService)
		private weixinQrcodeService: WeixinQrcodeService,
	) {}
	@Get('/')
	@ApiOkResponse({
		description: '商品列表',
	})
	@ApiOperation({ title: '商品列表', description: '商品列表' })
	async list(
		@Query() pagination: Pagination,
		@Query('category', new MongodIdPipe()) category: string,
		@Query('isLimit') isLimit: boolean,
		@Query('isHot') isHot: boolean,
		@Query('preSale') preSale: boolean,
		@Query('isNewUser') isNewUser: boolean,
	): Promise<any> {
		const now = Date.now();
		const condition: any = {};
		if (category) {
			condition.category = category;
		}
		if (isLimit) {
			return await this.goodService.listByUser(pagination, {
				...condition,
				isLimit: true,
				limitEndTime: { $gte: now },
			});
		}
		if (preSale) {
			return await this.goodService.listByUser(pagination, {
				...condition,
				preSale: true,
				preSaleEndTime: { $gte: now },
			});
		}
		if (isHot) {
			return await this.goodService.listByUser(pagination, {
				...condition,
				isHot: true,
			});
		}
		if (isNewUser) {
			return await this.goodService.listByUser(pagination, {
				...condition,
				isNewUser: true,
			});
		}
		return await this.goodService.listByUser(pagination, condition);
	}

	@Get('/vip')
	@ApiOkResponse({
		description: 'vip折扣',
	})
	@ApiOperation({ title: 'vip折扣', description: 'vip折扣' })
	async vip(): Promise<any> {
		return 100;
	}

	@Get('/search')
	@ApiOkResponse({
		description: '商品列表',
	})
	@ApiOperation({ title: '商品列表', description: '商品列表' })
	async search(
		@Query() pagination: Pagination,
		@Query('keyword') keyword: string,
	): Promise<any> {
		if (!keyword) {
			return { list: [], total: 0 };
		}
		const categorys: string[] = await this.categoryService.search(keyword);
		const search: any = [];
		search.push({ name: new RegExp(keyword, 'i') });
		search.push({ keyword: new RegExp(keyword, 'i') });
		search.push({ category: { $in: categorys } });
		const condition = { $or: search, isDelete: false };
		return await this.goodService.listByUser(pagination, condition);
	}

	@Get('/:id')
	@ApiOkResponse({
		description: '商品详情',
	})
	@ApiOperation({ title: '商品详情', description: '商品详情' })
	async findById(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		const data = await this.goodService.findByIdWithProduct(id);
		const comments = await this.commentService.findByBoundToObjectId(
			{ current: 1, pageSize: 10 },
			id,
		);
		let isCollect = false;
		const headers = req.headers;
		if (headers.authorization) {
			const token = headers.authorization.replace('Bearer', '').trim();
			if (token) {
				const payload = this.jwtService.verify(token);
				if (payload.type === 'user') {
					const collect = await this.collectService.findOne({
						user: payload.id,
						bondToObjectId: id,
						bondType: 1,
					});
					isCollect = collect ? true : false;
				}
			}
		}
		return { ...data, comments, isCollect };
	}

	@Get('/:id/comments')
	@ApiOkResponse({
		description: '商品评论列表',
	})
	@ApiOperation({ title: '商品评论列表', description: '商品评论列表' })
	async limitList(
		@Param('id', new MongodIdPipe()) id: string,
		@Query() pagination: Pagination,
	): Promise<any> {
		return await this.commentService.findByBoundToObjectId(pagination, id);
	}

	@Post('/:id/collect')
	@ApiOkResponse({
		description: '收藏商品',
	})
	@UseGuards(AuthGuard())
	@ApiOperation({ title: '收藏商品', description: '收藏商品' })
	async collect(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		const collect: CreateCollectDTO = {
			bondType: 1,
			user: req.user._id,
			bondToObjectId: id,
		};
		return await this.collectService.create(collect);
	}

	@Delete('/:id/collect')
	@ApiOkResponse({
		description: '取消收藏商品',
	})
	@UseGuards(AuthGuard())
	@ApiOperation({ title: '取消收藏商品', description: '取消收藏商品' })
	async cancelCollect(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		const condition: CreateCollectDTO = {
			bondType: 1,
			user: req.user._id,
			bondToObjectId: id,
		};
		return await this.collectService.removeByCondition(condition);
	}

	@Get('/:id/qrcode')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '获取商品分享二维码',
	})
	@ApiOperation({
		title: '获取商品分享二维码',
		description: '获取商品分享二维码',
	})
	async qrcode(
		@Param('id', new MongodIdPipe()) id: string,
		@Query('page') page: string,
		@Request() req: any,
	): Promise<any> {
		const weixinQrcode: CreateWeixinQrcodeDTO = {
			user: String(req.user._id),
			bondType: 1,
			bondToObjectId: id,
			page,
		};
		const url = await this.weixinQrcodeService.create(weixinQrcode);
		return { url };
	}
}
