import { UseGuards, Controller, Get, Query, Put, Body } from '@nestjs/common';
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
import { IntegrationSummaryService } from 'src/module/integrationSummary/integrationSummary.service';
import { UpdateAmountDTO } from 'src/module/integrationSummary/integrationSummary.dto';
import { IntegrationService } from 'src/module/integration/integration.service';
@ApiUseTags('cms/integrationSummary')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/integrationSummarys')
export class CMSIntegrationSummaryController {
	constructor(
		private integrationSummaryService: IntegrationSummaryService,
		private integrationService: IntegrationService,
	) {}

	@Get('/summary')
	@Roles(1)
	@ApiOkResponse({
		description: '积分汇总列表',
	})
	@ApiOperation({ title: '积分汇总列表', description: '积分汇总列表' })
	async summary(): Promise<any> {
		return await this.integrationSummaryService.summary();
	}

	@Get('/list')
	@Roles(1)
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

	@Put('/amount')
	@Roles(1)
	@ApiOkResponse({
		description: '修改承兑池',
	})
	@ApiOperation({ title: '修改承兑池', description: '修改承兑池' })
	async amount(@Body() amount: UpdateAmountDTO): Promise<any> {
		return await this.integrationService.updateAmount(amount.amount);
	}
}
