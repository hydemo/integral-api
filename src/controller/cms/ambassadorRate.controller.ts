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
import { CreateAmbassadorRateDTO } from 'src/module/ambassadorRate/ambassadorRate.dto';
import { AmbassadorRateService } from 'src/module/ambassadorRate/ambassadorRate.service';
@ApiUseTags('cms/ambassadorRate')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/ambassadorRates')
export class CMSAmbassadorRateController {
	constructor(private ambassadorRateService: AmbassadorRateService) {}

	@Get('/')
	@Roles(0)
	@ApiOkResponse({
		description: '大使分发比例列表',
	})
	@ApiOperation({ title: '大使分发比例列表', description: '大使分发比例列表' })
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.ambassadorRateService.list(pagination);
	}

	@Get('/:id')
	@Roles(0)
	@ApiOkResponse({
		description: '大使分发比例详情',
	})
	@ApiOperation({ title: '大使分发比例详情', description: '大使分发比例详情' })
	async detail(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		return await this.ambassadorRateService.detail(id);
	}

	@Post('/')
	@Roles(0)
	@ApiOkResponse({
		description: '新增大使分发比例',
	})
	@ApiOperation({ title: '新增大使分发比例', description: '新增大使分发比例' })
	async create(
		@Body() ambassadorRate: CreateAmbassadorRateDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.ambassadorRateService.create(
			ambassadorRate,
			String(req.user._id),
		);
	}

	@Put('/:id')
	@Roles(0)
	@ApiOkResponse({
		description: '修改大使分发比例',
	})
	@ApiOperation({ title: '修改大使分发比例', description: '修改大使分发比例' })
	async update(
		@Body() ambassadorRate: CreateAmbassadorRateDTO,
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.ambassadorRateService.update(id, ambassadorRate);
	}

	@Delete('/:id')
	@Roles(0)
	@ApiOkResponse({
		description: '删除大使分发比例',
	})
	@ApiOperation({ title: '删除大使分发比例', description: '删除大使分发比例' })
	async remove(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		return await this.ambassadorRateService.remove(id);
	}
}
