import { UseGuards, Controller, Get, Request } from '@nestjs/common';
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
import { IntegrationRateService } from 'src/module/integrationRate/integrationRate.service';
import { AmbassadorRateService } from 'src/module/ambassadorRate/ambassadorRate.service';
@ApiUseTags('integration')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('/api/integrations')
export class ApiIntegrationController {
	constructor(
		private integrationSummaryService: IntegrationSummaryService,
		private integrationRateService: IntegrationRateService,
		private ambassadorRateService: AmbassadorRateService,
	) {}

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

	@Get('/rate')
	@ApiOkResponse({
		description: '积分比例',
	})
	@ApiOperation({ title: '积分比例', description: '积分比例' })
	async getRate(@Request() req: any): Promise<any> {
		const integrationRate = await this.integrationRateService.getRate();
		const buyRate = integrationRate[1];
		let shareRate = integrationRate[3];
		if (req.user.ambassadorLevel) {
			const ambassadorRate = await this.ambassadorRateService.getRate(
				req.user.ambassadorLevel,
			);
			shareRate = ambassadorRate[3];
		}
		return { buyRate, shareRate };
	}
}
