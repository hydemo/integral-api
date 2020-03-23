import {
	UseGuards,
	Controller,
	Request,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	Query,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { Pagination } from 'src/common/dto/pagination.dto';
import { CreateAmbassadorCardDTO } from 'src/module/ambassadorCard/ambassadorCard.dto';
import { AmbassadorCardService } from 'src/module/ambassadorCard/ambassadorCard.service';
@ApiUseTags('cms/ambassadorCard')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/ambassadorCards')
export class CMSAmbassadorCardController {
	constructor(private ambassadorCardService: AmbassadorCardService) {}

	@Get('/')
	@Roles(1)
	@ApiOkResponse({
		description: '大使码列表',
	})
	@ApiOperation({ title: '大使码列表', description: '大使码列表' })
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.ambassadorCardService.list(pagination);
	}

	@Post('/')
	@Roles(1)
	@ApiOkResponse({
		description: '新增大使码',
	})
	@ApiOperation({ title: '新增大使码', description: '新增大使码' })
	async create(
		@Body() ambassadorCard: CreateAmbassadorCardDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.ambassadorCardService.create(
			ambassadorCard,
			String(req.user._id),
		);
	}

	@Put('/:id')
	@Roles(1)
	@ApiOkResponse({
		description: '修改大使码',
	})
	@ApiOperation({ title: '修改大使码', description: '修改大使码' })
	async update(
		@Body() ambassadorCard: CreateAmbassadorCardDTO,
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.ambassadorCardService.findByIdAndUpdate(
			id,
			ambassadorCard,
		);
	}

	@Delete('/:id')
	@Roles(1)
	@ApiOkResponse({
		description: '删除大使码',
	})
	@ApiOperation({ title: '删除大使码', description: '删除大使码' })
	async remove(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return await this.ambassadorCardService.findByIdAndRemove(id, req.user._id);
	}

	@Put('/:id/recover')
	@Roles(1)
	@ApiOkResponse({
		description: '恢复大使码',
	})
	@ApiOperation({ title: '恢复大使码', description: '恢复大使码' })
	async recover(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		return await this.ambassadorCardService.recoverById(id);
	}
}
