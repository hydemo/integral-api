import { Controller, Get, Request } from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiBearerAuth,
} from '@nestjs/swagger';
import * as moment from 'moment';
import { IntegrationSummaryService } from 'src/module/integrationSummary/integrationSummary.service';
import { IntegrationRateService } from 'src/module/integrationRate/integrationRate.service';
import { AmbassadorRateService } from 'src/module/ambassadorRate/ambassadorRate.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/module/user/user.service';
@ApiUseTags('integration')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('/api/integrations')
export class ApiIntegrationController {
	constructor(
		private readonly integrationSummaryService: IntegrationSummaryService,
		private readonly integrationRateService: IntegrationRateService,
		private readonly ambassadorRateService: AmbassadorRateService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
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
		const now = moment().format('HH:mm:ss');
		let minus = -1;
		if (now < '20:00:00') {
			minus = -2;
		}
		let priceOfYestoday = 0.01;
		const yestoday = await this.integrationSummaryService.findOneByDate(
			moment()
				.add(minus, 'd')
				.format('YYYY-MM-DD'),
		);
		if (yestoday) {
			priceOfYestoday = yestoday.integrationPrice;
		}
		return { price: integrationPrice, priceOfYestoday };
	}

	@Get('/rate')
	@ApiOkResponse({
		description: '积分比例',
	})
	@ApiOperation({ title: '积分比例', description: '积分比例' })
	async getRate(@Request() req: any): Promise<any> {
		const integrationRate = await this.integrationRateService.getRate();
		let buyRate = integrationRate[1] || 0;
		let shareRate = integrationRate[3] || 0;
		const headers = req.headers;
		if (headers.authorization) {
			const token = headers.authorization.replace('Bearer', '').trim();
			if (token) {
				let payload: any = {};
				try {
					payload = await this.jwtService.verify(token);
				} catch (error) {}
				if (payload.type === 'user') {
					const user = await this.userService.findById(payload.id);
					if (user && user.ambassadorLevel) {
						const ambassadorRate = await this.ambassadorRateService.getRate(
							user.ambassadorLevel,
						);
						if (ambassadorRate[1]) {
							buyRate = ambassadorRate[1];
						}
						if (ambassadorRate[3]) {
							shareRate = ambassadorRate[3];
						}
					}
				}
			}
		}
		return { buyRate, shareRate };
	}
}
