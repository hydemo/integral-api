import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { serviceFeeProviders } from './serviceFee.providers';
import { ServiceFeeService } from './serviceFee.service';

@Module({
  providers: [
    ServiceFeeService,
    ...serviceFeeProviders,
  ],
  exports: [
    ServiceFeeService,
  ],
  imports: [
    DatabaseModule,
  ],
})
export class ServiceFeeModule { }