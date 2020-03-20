import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { cartsProviders } from './cart.providers';
import { DatabaseModule } from '@database/database.module';
import { ProductModule } from '../product/product.module';
import { GoodModule } from '../good/good.module';

@Module({
	providers: [CartService, ...cartsProviders],
	exports: [CartService],
	imports: [DatabaseModule, ProductModule, GoodModule],
})
export class CartModule {}
