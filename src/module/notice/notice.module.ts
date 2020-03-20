import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { noticeProviders } from './notice.providers';
import { NoticeService } from './notice.service';

@Module({
	providers: [NoticeService, ...noticeProviders],
	exports: [NoticeService],
	imports: [DatabaseModule],
})
export class NoticeModule {}
