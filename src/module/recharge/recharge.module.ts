import { Module } from '@nestjs/common';
import { RechargeService } from './recharge.service';
import { rechargesProviders } from './recharge.providers';
import { DatabaseModule } from '@database/database.module';
import { UserBalanceModule } from '../userBalance/userBalance.module';

@Module({
  providers: [
    RechargeService,
    ...rechargesProviders,
  ],
  exports: [RechargeService],
  imports: [
    DatabaseModule,
    UserBalanceModule,
  ],
})

export class RechargeModule { }
