import {
	Controller,
	Get,
	Query,
	UseGuards,
	Inject,
	Post,
	Put,
	Param,
	Body,
	Delete,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
} from '@nestjs/swagger';
import { ProductService } from 'src/module/product/product.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import {
	UpdateStockDTO,
	CreateProductDTO,
} from 'src/module/product/product.dto';

@ApiUseTags('cms/product')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/products')
export class CMSProductController {
	constructor(@Inject(ProductService) private productService: ProductService) {}

	@Get('/warn')
	@Roles(1)
	@ApiOkResponse({
		description: '库存不足商品',
	})
	@ApiOperation({ title: '库存不足商品', description: '库存不足商品' })
	async warn(@Query() pagination: Pagination): Promise<any> {
		return await this.productService.warn(pagination);
	}

	// @Put('/:id/stock')
	// @Roles(1)
	// @ApiOkResponse({
	//   description: '修改库存',
	// })
	// @ApiOperation({ title: '修改库存', description: '修改库存' })
	// async list(
	//   @Param('id', new MongodIdPipe()) id: string,
	//   @Body() stock: UpdateStockDTO,
	// ): Promise<any> {
	//   return await this.productService.findByIdAndUpdate(id, stock)

	// }

	@Delete('/:id')
	@ApiOkResponse({
		description: '删除',
	})
	@Roles(1)
	@ApiOperation({ title: '删除', description: '删除' })
	async removeByCarousel(
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.productService.findByIdAndDelete(id);
	}

	@Put('/:id')
	@ApiOkResponse({
		description: '修改',
	})
	@Roles(1)
	@ApiOperation({ title: '修改', description: '修改' })
	async recoverByCarousel(
		@Param('id', new MongodIdPipe()) id: string,
		@Body() product: CreateProductDTO,
	): Promise<any> {
		return await this.productService.findByIdAndUpdate(id, product);
	}
}
