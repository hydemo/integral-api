import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { ambassadorCardProviders } from './ambassadorCard.providers';
import { AmbassadorCardService } from './ambassadorCard.service';

@Module({
  providers: [
    AmbassadorCardService,
    ...ambassadorCardProviders,
  ],
  exports: [
    AmbassadorCardService,
  ],
  imports: [
    DatabaseModule,
  ],
})
export class AmbassadorCardModule { }