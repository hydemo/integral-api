import { Module } from '@nestjs/common';

import { DatabaseModule } from '@database/database.module';
import { commentsProviders } from './comment.provider';
import { CommentService } from './comment.service';

@Module({
  providers: [
    CommentService,
    ...commentsProviders,
  ],
  exports: [CommentService],
  imports: [
    DatabaseModule,
  ],
})

export class CommentModule { }
