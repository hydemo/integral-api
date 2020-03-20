import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { integrationRateProviders } from './integrationRate.providers';
import { IntegrationRateService } from './integrationRate.service';

@Module({
	providers: [IntegrationRateService, ...integrationRateProviders],
	exports: [IntegrationRateService],
	imports: [DatabaseModule],
})
export class IntegrationRateModule {}
