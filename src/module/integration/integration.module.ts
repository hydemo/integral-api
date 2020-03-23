import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { integrationProviders } from './integration.providers';
import { IntegrationService } from './integration.service';
import { UserModule } from '../user/user.module';
import { ServiceFeeModule } from '../serviceFee/serviceFee.module';
import { IntegrationRateModule } from '../integrationRate/integrationRate.module';
import { IntegrationSummaryModule } from '../integrationSummary/integrationSummary.module';
import { UserBalanceModule } from '../userBalance/userBalance.module';

@Module({
	providers: [IntegrationService, ...integrationProviders],
	exports: [IntegrationService],
	imports: [
		UserModule,
		DatabaseModule,
		ServiceFeeModule,
		IntegrationRateModule,
		UserBalanceModule,
		IntegrationSummaryModule,
	],
})
export class IntegrationModule {}
