import {
	Controller,
	Get,
	Query,
	UseGuards,
	Inject,
	Param,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from 'src/module/category/category.service';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';

@ApiUseTags('category')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/categories')
export class ApiCategoryController {
	constructor(
		@Inject(CategoryService) private categoryService: CategoryService,
	) {}

	@Get('')
	@ApiOkResponse({
		description: '分类列表',
	})
	@ApiOperation({ title: '分类列表', description: '分类列表' })
	async firstLayer(): Promise<any> {
		return await this.categoryService.firstLayer();
	}

	@Get('/top')
	@ApiOkResponse({
		description: '首页分类列表',
	})
	@ApiOperation({ title: '首页分类列表', description: '首页分类列表' })
	async top(): Promise<any> {
		return await this.categoryService.top();
	}

	@Get(':id/secondLayer')
	@ApiOkResponse({
		description: '子分类列表',
	})
	@ApiOperation({ title: '子分类列表', description: '子分类列表' })
	async secondLayer(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		return await this.categoryService.secondLayer(id);
	}
}
