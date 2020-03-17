import { Module } from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { specificationsProviders } from './specification.providers';
import { DatabaseModule } from '@database/database.module';

@Module({
  providers: [
    SpecificationService,
    ...specificationsProviders,
  ],
  exports: [SpecificationService],
  imports: [
    DatabaseModule,
  ],
})

export class SpecificationModule { }
