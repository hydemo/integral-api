import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { categoryRecordProviders } from './categoryRecord.providers';
import { CategoryRecordService } from './categoryRecord.service';

@Module({
	providers: [CategoryRecordService, ...categoryRecordProviders],
	exports: [CategoryRecordService],
	imports: [DatabaseModule],
})
export class CategoryRecordModule {}
