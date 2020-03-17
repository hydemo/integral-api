import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { vipProviders } from './vip.providers';
import { VipService } from './vip.service';

@Module({
  providers: [
    VipService,
    ...vipProviders,
  ],
  exports: [
    VipService,
  ],
  imports: [
    DatabaseModule,
  ],
})
export class VipModule { }