import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { ambassadorRateProviders } from './ambassadorRate.providers';
import { AmbassadorRateService } from './ambassadorRate.service';

@Module({
  providers: [
    AmbassadorRateService,
    ...ambassadorRateProviders,
  ],
  exports: [
    AmbassadorRateService,
  ],
  imports: [
    DatabaseModule,
  ],
})
export class AmbassadorRateModule { }