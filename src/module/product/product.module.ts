import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { productsProviders } from './product.providers';
import { DatabaseModule } from '@database/database.module';

@Module({
  providers: [
    ProductService,
    ...productsProviders,
  ],
  exports: [ProductService],
  imports: [
    DatabaseModule,
  ],
})

export class ProductModule { }
