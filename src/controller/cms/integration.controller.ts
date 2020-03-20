import { UseGuards, Controller, Get, Query } from '@nestjs/common';
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
import { Pagination } from 'src/common/dto/pagination.dto';
import { IntegrationService } from 'src/module/integration/integration.service';
@ApiUseTags('cms/integration')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/integrations')
export class CMSIntegrationController {
	constructor(private integrationService: IntegrationService) {}

	@Get('/')
	@Roles(0)
	@ApiOkResponse({
		description: '积分记录列表',
	})
	@ApiOperation({ title: '积分记录列表', description: '积分记录列表' })
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.integrationService.list(pagination);
	}
}
