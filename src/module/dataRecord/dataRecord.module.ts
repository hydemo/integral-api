import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { dataRecordProviders } from './dataRecord.providers';
import { DataRecordService } from './dataRecord.service';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { GoodModule } from '../good/good.module';
import { OrderModule } from '../order/order.module';
import { UserRecordModule } from '../userRecord/userRecord.module';
import { CategoryRecordModule } from '../categoryRecord/categoryRecord.module';
import { GoodRecordModule } from '../goodRecord/goodRecord.module';

@Module({
	providers: [DataRecordService, ...dataRecordProviders],
	exports: [DataRecordService],
	imports: [
		DatabaseModule,
		UserModule,
		CategoryModule,
		GoodModule,
		OrderModule,
		UserRecordModule,
		CategoryRecordModule,
		GoodRecordModule,
	],
})
export class DataRecordModule {}
