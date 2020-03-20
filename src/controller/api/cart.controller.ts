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
	Put,
	Response,
	Delete,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
} from '@nestjs/swagger';
import {
	CreateCartDTO,
	DeleteManyDTO,
	CountDTO,
} from 'src/module/cart/cart.dto';
import { CartService } from 'src/module/cart/cart.service';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';

@ApiUseTags('cart')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('api/carts')
export class ApiCartController {
	constructor(@Inject(CartService) private cartService: CartService) {}

	@Get('/')
	@ApiOkResponse({
		description: '购物车列表',
	})
	@ApiOperation({ title: '购物车列表', description: '购物车列表' })
	async list(
		@Query() pagination: Pagination,
		@Request() req: any,
	): Promise<any> {
		return await this.cartService.list(pagination, req.user._id);
	}

	@Get('/count')
	@ApiOkResponse({
		description: '购物车数量',
	})
	@ApiOperation({ title: '购物车数量', description: '购物车数量' })
	async count(@Request() req: any): Promise<any> {
		return await this.cartService.count(req.user._id);
	}

	@Post('/')
	@ApiOkResponse({
		description: '添加到购物车',
	})
	@ApiOperation({ title: '购物车列表', description: '购物车列表' })
	async addToCart(
		@Body() cart: CreateCartDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.cartService.create(cart, req.user._id);
	}

	@Delete('/all')
	@ApiOkResponse({
		description: '清空购物车',
	})
	@ApiOperation({ title: '清空购物车', description: '清空购物车' })
	async clean(@Request() req: any): Promise<any> {
		return await this.cartService.clean(req.user._id);
	}

	@Delete('/many')
	@ApiOkResponse({
		description: '删除多个购物车',
	})
	@ApiOperation({ title: '删除多个购物车', description: '删除多个购物车' })
	async deleteMany(
		@Request() req: any,
		@Body() carts: DeleteManyDTO,
	): Promise<any> {
		return await this.cartService.deleteMany({
			_id: { $in: carts.carts },
			user: req.user._id,
		});
	}

	@Delete('/:id')
	@ApiOkResponse({
		description: '删除购物车',
	})
	@ApiOperation({ title: '删除购物车', description: '删除购物车' })
	async remove(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return await this.cartService.findByIdAndDelete(id, req.user._id);
	}

	@Put('/:id/count')
	@ApiOkResponse({
		description: '增加购物车数量',
	})
	@ApiOperation({ title: '增加购物车数量', description: '增加购物车数量' })
	async incCount(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
		@Body() count: CountDTO,
	): Promise<any> {
		return await this.cartService.incCount(id, count, req.user._id);
	}
}
