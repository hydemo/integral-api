import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { ordersProviders } from './order.providers';
import { DatabaseModule } from '@database/database.module';
import { ProductModule } from '../product/product.module';
import { GoodModule } from '../good/good.module';
import { AddressModule } from '../address/address.module';
import { CartModule } from '../cart/cart.module';
import { CommentModule } from '../comment/comment.module';
import { ShipperModule } from '../shipper/shipper.module';
import { NoticeModule } from '../notice/notice.module';
import { UserCouponModule } from '../userCoupon/userCoupon.module';
import { IntegrationModule } from '../integration/integration.module';
import { UserBalanceModule } from '../userBalance/userBalance.module';
import { ShipFeeModule } from '../shipFee/shipFee.module';
import { GoodRecordModule } from '../goodRecord/goodRecord.module';
import { UserRecordModule } from '../userRecord/userRecord.module';
import { CategoryRecordModule } from '../categoryRecord/categoryRecord.module';
import { IntegrationSummaryModule } from '../integrationSummary/integrationSummary.module';
import { IntegrationRateModule } from '../integrationRate/integrationRate.module';
import { UserModule } from '../user/user.module';
import { ServiceFeeModule } from '../serviceFee/serviceFee.module';
import { AmbassadorRateService } from '../ambassadorRate/ambassadorRate.service';
import { AmbassadorRateModule } from '../ambassadorRate/ambassadorRate.module';

@Module({
	providers: [OrderService, ...ordersProviders],
	exports: [OrderService],
	imports: [
		NoticeModule,
		DatabaseModule,
		ProductModule,
		GoodModule,
		CartModule,
		AddressModule,
		CommentModule,
		GoodModule,
		ShipperModule,
		UserCouponModule,
		IntegrationModule,
		UserBalanceModule,
		ShipFeeModule,
		UserRecordModule,
		GoodRecordModule,
		IntegrationSummaryModule,
		IntegrationRateModule,
		UserModule,
		ServiceFeeModule,
		AmbassadorRateModule,
	],
})
export class OrderModule {}
