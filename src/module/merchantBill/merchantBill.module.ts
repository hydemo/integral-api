import { Module } from '@nestjs/common';
import { MerchantBillService } from './merchantBill.service';
import { merchantBillsProviders } from './merchantBill.providers';
import { DatabaseModule } from '@database/database.module';

@Module({
  providers: [
    MerchantBillService,
    ...merchantBillsProviders,
  ],
  exports: [MerchantBillService],
  imports: [
    DatabaseModule,
  ],
})

export class MerchantBillModule { }
