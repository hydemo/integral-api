import { Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { merchantsProviders } from './merchant.providers';
import { DatabaseModule } from '@database/database.module';
import { UserBalanceModule } from '../userBalance/userBalance.module';
import { MerchantBillModule } from '../merchantBill/merchantBill.module';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  providers: [
    MerchantService,
    ...merchantsProviders,
  ],
  exports: [MerchantService],
  imports: [
    DatabaseModule,
    MerchantBillModule,
    UserBalanceModule,
    IntegrationModule
  ],
})

export class MerchantModule { }
