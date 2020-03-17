import { Module, Global } from '@nestjs/common';
import { InitService } from './init.service';
import { AdminModule } from 'src/module/admin/admin.module';
import { RefundModule } from 'src/module/refund/refund.module';
import { UserCouponModule } from 'src/module/userCoupon/userCoupon.module';
import { CategoryRecordModule } from 'src/module/categoryRecord/categoryRecord.module';
import { GoodRecordModule } from 'src/module/goodRecord/goodRecord.module';

@Global()
@Module({
  providers: [
    InitService,
  ],
  imports: [
    AdminModule,
    UserCouponModule,
  ],
  exports: [InitService],
})
export class InitModule { }