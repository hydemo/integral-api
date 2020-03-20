import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { logProviders } from './logRecord.providers';
import { LogService } from './logRecord.service';

@Module({
	providers: [LogService, ...logProviders],
	exports: [LogService],
	imports: [DatabaseModule],
})
export class LogModule {}
