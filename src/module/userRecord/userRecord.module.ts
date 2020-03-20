import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { userRecordProviders } from './userRecord.providers';
import { UserRecordService } from './userRecord.service';

@Module({
	providers: [UserRecordService, ...userRecordProviders],
	exports: [UserRecordService],
	imports: [DatabaseModule],
})
export class UserRecordModule {}
