import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { addresssProviders } from './address.providers';
import { DatabaseModule } from '@database/database.module';
import { ProductModule } from '../product/product.module';
import { GoodModule } from '../good/good.module';

@Module({
  providers: [
    AddressService,
    ...addresssProviders,
  ],
  exports: [AddressService],
  imports: [
    DatabaseModule,
    ProductModule,
    GoodModule,
  ],
})

export class AddressModule { }
