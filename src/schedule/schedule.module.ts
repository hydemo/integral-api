import { Module, Global } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { OrderModule } from 'src/module/order/order.module';
import { DataRecordModule } from 'src/module/dataRecord/dataRecord.module';
import { UserRecordModule } from 'src/module/userRecord/userRecord.module';
import { CategoryRecordModule } from 'src/module/categoryRecord/categoryRecord.module';
import { GoodRecordModule } from 'src/module/goodRecord/goodRecord.module';
@Global()

@Module({
  providers: [
    ScheduleService,
  ],
  imports: [
    OrderModule,
    DataRecordModule,
    UserRecordModule,
    CategoryRecordModule,
    GoodRecordModule,
  ],
  exports: [ScheduleService],
})
export class ScheduleModule { }