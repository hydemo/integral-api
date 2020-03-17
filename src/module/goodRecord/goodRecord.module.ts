import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { goodRecordProviders } from './goodRecord.providers';
import { GoodRecordService } from './goodRecord.service';
import { GoodModule } from '../good/good.module';
import { CategoryRecordModule } from '../categoryRecord/categoryRecord.module';

@Module({
  providers: [
    GoodRecordService,
    ...goodRecordProviders,
  ],
  exports: [
    GoodRecordService,
  ],
  imports: [
    DatabaseModule,
    GoodModule,
    CategoryRecordModule,
  ],
})
export class GoodRecordModule { }