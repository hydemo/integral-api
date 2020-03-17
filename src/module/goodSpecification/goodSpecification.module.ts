import { Module } from '@nestjs/common';
import { GoodSpecificationService } from './goodSpecification.service';
import { goodSpecificationsProviders } from './goodSpecification.providers';
import { DatabaseModule } from '@database/database.module';

@Module({
  providers: [
    GoodSpecificationService,
    ...goodSpecificationsProviders,
  ],
  exports: [GoodSpecificationService],
  imports: [
    DatabaseModule,
  ],
})

export class GoodSpecificationModule { }
