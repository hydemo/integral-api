import {
	Body,
	Controller,
	Get,
	Param,
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
import { CollectService } from 'src/module/collect/collect.service';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { DeleteManyDTO } from 'src/module/collect/collect.dto';

@ApiUseTags('collect')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('api/collects')
export class ApiCollectController {
	constructor(@Inject(CollectService) private collectService: CollectService) {}

	@Get('/')
	@ApiOkResponse({
		description: '收藏列表',
	})
	@ApiOperation({ title: '收藏列表', description: '收藏列表' })
	async list(
		@Query() pagination: Pagination,
		@Query('type') type: number,
		@Request() req: any,
	): Promise<any> {
		return await this.collectService.list(
			pagination,
			req.user._id,
			Number(type),
		);
	}

	@Delete('/all')
	@ApiOkResponse({
		description: '清空收藏',
	})
	@ApiOperation({ title: '清空收藏', description: '清空收藏' })
	async clean(@Request() req: any): Promise<any> {
		return await this.collectService.clean(req.user._id);
	}

	@Delete('/many')
	@ApiOkResponse({
		description: '删除多个收藏',
	})
	@ApiOperation({ title: '删除多个收藏', description: '删除多个收藏' })
	async deleteMany(
		@Request() req: any,
		@Body() collects: DeleteManyDTO,
	): Promise<any> {
		return await this.collectService.deleteMany({
			_id: { $in: collects.collects },
			user: req.user._id,
		});
	}

	@Delete('/:id')
	@ApiOkResponse({
		description: '删除收藏',
	})
	@ApiOperation({ title: '删除收藏', description: '删除收藏' })
	async remove(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return await this.collectService.remove(id, req.user._id);
	}
}
