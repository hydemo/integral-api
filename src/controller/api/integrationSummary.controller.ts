import { UseGuards, Controller, Get, Query } from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IntegrationSummaryService } from 'src/module/integrationSummary/integrationSummary.service';

@ApiUseTags('integrationSummary')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('integrationSummarys')
export class ApiIntegrationSummaryController {
	constructor(private integrationSummaryService: IntegrationSummaryService) {}

	@Get('')
	@ApiOkResponse({
		description: '根据时间查询',
	})
	@ApiOperation({ title: '积分汇总列表', description: '积分汇总列表' })
	async list(
		@Query('start') start: string,
		@Query('end') end: string,
	): Promise<any> {
		return await this.integrationSummaryService.getRecordBetween(start, end);
	}
}
