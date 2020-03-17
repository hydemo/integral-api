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
import { VipModule } from '../vip/vip.module';
import { MerchantModule } from '../merchant/merchant.module';
import { GoodRecordModule } from '../goodRecord/goodRecord.module';
import { UserRecordModule } from '../userRecord/userRecord.module';
import { CategoryRecordModule } from '../categoryRecord/categoryRecord.module';

@Module({
  providers: [
    OrderService,
    ...ordersProviders,
  ],
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
    VipModule,
    MerchantModule,
    UserRecordModule,
    GoodRecordModule

  ],
})

export class OrderModule { }
