import { Module } from '@nestjs/common';
import { RefundService } from './refund.service';
import { refundsProviders } from './refund.providers';
import { DatabaseModule } from '@database/database.module';
import { ProductModule } from '../product/product.module';
import { GoodModule } from '../good/good.module';
import { AddressModule } from '../address/address.module';
import { CartModule } from '../cart/cart.module';
import { CommentModule } from '../comment/comment.module';
import { ShipperModule } from '../shipper/shipper.module';
import { OrderModule } from '../order/order.module';
import { IntegrationModule } from '../integration/integration.module';
import { UserCouponModule } from '../userCoupon/userCoupon.module';
import { IntegrationSummaryModule } from '../integrationSummary/integrationSummary.module';

@Module({
	providers: [RefundService, ...refundsProviders],
	exports: [RefundService],
	imports: [
		DatabaseModule,
		AddressModule,
		OrderModule,
		ShipperModule,
		IntegrationModule,
		UserCouponModule,
		IntegrationSummaryModule,
	],
})
export class RefundModule {}
