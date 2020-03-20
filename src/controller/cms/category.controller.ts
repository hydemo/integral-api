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
import { CreateCategoryDTO } from 'src/module/category/category.dto';
import { CategoryService } from 'src/module/category/category.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';

@ApiUseTags('cms/category')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/categories')
export class CMSCategoryController {
	constructor(
		@Inject(CategoryService) private categoryService: CategoryService,
	) {}

	@Get('/')
	@Roles(1)
	@ApiOkResponse({
		description: '分类列表',
	})
	@ApiOperation({ title: '分类列表', description: '分类列表' })
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.categoryService.list(pagination);
	}

	@Get('/all')
	@Roles(1)
	@ApiOkResponse({
		description: '全部分类列表',
	})
	@ApiOperation({ title: '分类列表', description: '全部分类列表' })
	async all(): Promise<any> {
		return await this.categoryService.all();
	}

	@Post('/')
	@Roles(1)
	@ApiOkResponse({
		description: '新增分类',
	})
	@ApiOperation({ title: '新增分类', description: '新增分类' })
	async add(
		@Body() category: CreateCategoryDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.categoryService.create(category, String(req.user._id));
	}

	@Delete('/:id')
	@ApiOkResponse({
		description: '删除',
	})
	@Roles(1)
	@ApiOperation({ title: '删除', description: '删除' })
	async removeByCategory(
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.categoryService.findByIdAndRemove(id);
	}

	@Put('/:id')
	@ApiOkResponse({
		description: '修改',
	})
	@Roles(1)
	@ApiOperation({ title: '修改', description: '修改' })
	async recoverByCategory(
		@Param('id', new MongodIdPipe()) id: string,
		@Body() category: CreateCategoryDTO,
	): Promise<any> {
		return await this.categoryService.findByIdAndUpdate(id, category);
	}

	@Put('/:id/recover')
	@ApiOkResponse({
		description: '恢复',
	})
	@Roles(1)
	@ApiOperation({ title: '恢复', description: '恢复' })
	async recoverByAdmin(
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.categoryService.recoverById(id);
	}
}
