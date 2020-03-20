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
import { CreateIntegrationRateDTO } from 'src/module/integrationRate/integrationRate.dto';
import { IntegrationRateService } from 'src/module/integrationRate/integrationRate.service';
@ApiUseTags('cms/integrationRate')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/integrationRates')
export class CMSIntegrationRateController {
	constructor(private integrationRateService: IntegrationRateService) {}

	@Get('/')
	@Roles(1)
	@ApiOkResponse({
		description: '积分收益比重列表',
	})
	@ApiOperation({ title: '积分收益比重列表', description: '积分收益比重列表' })
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.integrationRateService.list(pagination);
	}

	@Get('/:id')
	@Roles(1)
	@ApiOkResponse({
		description: '积分收益比重详情',
	})
	@ApiOperation({ title: '积分收益比重详情', description: '积分收益比重详情' })
	async detail(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		return await this.integrationRateService.detail(id);
	}

	@Post('/')
	@Roles(1)
	@ApiOkResponse({
		description: '新增积分收益比重',
	})
	@ApiOperation({ title: '新增积分收益比重', description: '新增积分收益比重' })
	async create(
		@Body() integrationRate: CreateIntegrationRateDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.integrationRateService.create(
			integrationRate,
			String(req.user._id),
		);
	}

	@Put('/:id')
	@Roles(1)
	@ApiOkResponse({
		description: '修改积分收益比重',
	})
	@ApiOperation({ title: '修改积分收益比重', description: '修改积分收益比重' })
	async update(
		@Body() integrationRate: CreateIntegrationRateDTO,
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.integrationRateService.update(id, integrationRate);
	}

	@Delete('/:id')
	@Roles(1)
	@ApiOkResponse({
		description: '删除积分收益比重',
	})
	@ApiOperation({ title: '删除积分收益比重', description: '删除积分收益比重' })
	async remove(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		return await this.integrationRateService.remove(id);
	}
}
