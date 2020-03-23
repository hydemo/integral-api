import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { withdrawProviders } from './withdraw.providers';
import { WithdrawService } from './withdraw.service';

@Module({
  providers: [
    WithdrawService,
    ...withdrawProviders,
  ],
  exports: [
    WithdrawService,
  ],
  imports: [
    DatabaseModule,
  ],
})
export class WithdrawModule { }