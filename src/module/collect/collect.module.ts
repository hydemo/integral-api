import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { collectProviders } from './collect.providers';
import { CollectService } from './collect.service';
import { ProductModule } from '../product/product.module';

@Module({
  providers: [
    CollectService,
    ...collectProviders,
  ],
  exports: [
    CollectService,
  ],
  imports: [
    DatabaseModule,
    ProductModule,
  ],
})
export class CollectModule { }