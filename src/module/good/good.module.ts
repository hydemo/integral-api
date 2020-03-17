import { Module } from '@nestjs/common';
import { GoodService } from './good.service';
import { goodsProviders } from './good.providers';
import { DatabaseModule } from '@database/database.module';
import { ProductModule } from '../product/product.module';
import { GoodSpecificationModule } from '../goodSpecification/goodSpecification.module';

@Module({
  providers: [
    GoodService,
    ...goodsProviders,
  ],
  exports: [GoodService],
  imports: [
    DatabaseModule,
    GoodSpecificationModule,
    ProductModule,
  ],
})

export class GoodModule { }
