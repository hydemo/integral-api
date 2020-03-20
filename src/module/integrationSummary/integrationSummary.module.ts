import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { integrationSummaryProviders } from './integrationSummary.providers';
import { IntegrationSummaryService } from './integrationSummary.service';

@Module({
	providers: [IntegrationSummaryService, ...integrationSummaryProviders],
	exports: [IntegrationSummaryService],
	imports: [DatabaseModule],
})
export class IntegrationSummaryModule {}
