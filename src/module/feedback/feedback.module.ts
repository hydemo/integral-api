import { Module } from '@nestjs/common';

import { DatabaseModule } from '@database/database.module';
import { feedbacksProviders } from './feedback.provider';
import { FeedbackService } from './feedback.service';

@Module({
  providers: [
    FeedbackService,
    ...feedbacksProviders,
  ],
  exports: [FeedbackService],
  imports: [
    DatabaseModule,
  ],
})

export class FeedbackModule { }
