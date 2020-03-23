import { UseGuards, Controller, Get, Query } from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiBearerAuth,
} from '@nestjs/swagger';
import * as moment from 'moment';
import { AuthGuard } from '@nestjs/passport';
import { IntegrationSummaryService } from 'src/module/integrationSummary/integrationSummary.service';
@ApiUseTags('integration')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('/api/integrations')
export class ApiIntegrationController {
	constructor(private integrationSummaryService: IntegrationSummaryService) {}

	@Get('/price')
	@ApiOkResponse({
		description: '积分价格',
	})
	@ApiOperation({ title: '积分价格', description: '积分价格' })
	async getPrice(): Promise<any> {
		const {
			integrationPrice,
		} = await this.integrationSummaryService.findOneByDate(
			moment().format('YYYY-MM-DD'),
		);
		return { price: integrationPrice };
	}
}
