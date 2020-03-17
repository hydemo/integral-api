import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { InitModule } from './init/init.module';
import { AdminModule } from './module/admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'nestjs-redis';
import { ConfigService } from './config/config.service';
import { CryptoUtil } from './utils/crypto.util';
import { CMSAdminController } from './controller/cms/admin.controller';
import { CMSLoginController } from './controller/cms/login.controller';
import { CMSCategoryController } from './controller/cms/category.controller';
import { CategoryModule } from './module/category/category.module';
import { SpecificationModule } from './module/specification/specification.module';
import { CMSSpecificationController } from './controller/cms/specification.controller';
import { GoodModule } from './module/good/good.module';
import { CMSGoodController } from './controller/cms/good.controller';
import { UploadModule } from './upload/upload.module';
import { CMSCarouselController } from './controller/cms/carousel.controller';
import { CarouselModule } from './module/carousel/carousel.module';
import { MerchantModule } from './module/merchant/merchant.module';
import { CMSMerchantController } from './controller/cms/merchant.controller';
import { CMSRechargeController } from './controller/cms/recharge.controller';
import { RechargeModule } from './module/recharge/recharge.module';
import { UserModule } from './module/user/user.module';
import { ApiLoginController } from './controller/api/login.controller';
import { ApiCategoryController } from './controller/api/category.controller';
import { ApiCarouselController } from './controller/api/carousel.controller';
import { ApiGoodController } from './controller/api/good.controller';
import { ApiCartController } from './controller/api/cart.controller';
import { CartModule } from './module/cart/cart.module';
import { AddressModule } from './module/address/address.module';
import { ApiAddressController } from './controller/api/address.controller';
import { OrderModule } from './module/order/order.module';
import { KDBirdUtil } from './utils/kdbird.util';
import { ApiOrderController } from './controller/api/order.controller';
import { CMSOrderController } from './controller/cms/order.controller';
import { CMSExpressController } from './controller/cms/express.controller';
import { ShipperModule } from './module/shipper/shipper.module';
import { WeixinModule } from './module/weixin/weixin.module';
import { WeixinController } from './module/weixin/weixin.controller';
import { UploadController } from './upload/upload.controller';
import { QiniuUtil } from './utils/qiniu.util';
import { CMSUserController } from './controller/cms/user.controller';
import { ApiMerchantController } from './controller/api/merchant.controller';
import { ApiUserController } from './controller/api/user.controller';
import { PaginationUtil } from './utils/pagination.util';
import { UtilModule } from './utils/util.module';
import { ConfigModule } from './config/config.module';
import { ProductModule } from './module/product/product.module';
import { CMSProductController } from './controller/cms/product.controller';
import { ApiFeedbackController } from './controller/api/feedback.controller';
import { CMSFeedbackController } from './controller/cms/feedback.controller';
import { FeedbackModule } from './module/feedback/feedback.module';
import { CMSRefundController } from './controller/cms/refund.controller';
import { RefundModule } from './module/refund/refund.module';
import { ApiExpressController } from './controller/api/express.controller';
import { ApiRefundController } from './controller/api/refund.controller';
import { CMSAddressController } from './controller/cms/address.controller';
import { ScheduleModule } from './schedule/schedule.module';
import { CodeModule } from './module/code/code.module';
import { CMSCodeController } from './controller/cms/code.controller';
import { NoticeModule } from './module/notice/notice.module';
import { CMSNoticeController } from './controller/cms/notice.controller';
import { ApiNoticeController } from './controller/api/notice.controller';
import { CouponModule } from './module/coupon/coupon.module';
import { CMSCouponController } from './controller/cms/coupon.controller';
import { UserCouponModule } from './module/userCoupon/userCoupon.module';
import { ApiCouponController } from './controller/api/coupon.controller';
import { CMSCommentController } from './controller/cms/comment.controller';
import { CMSUserBalanceController } from './controller/cms/userBalance.controller';
import { UserBalanceModule } from './module/userBalance/userBalance.module';
import { IntegrationModule } from './module/integration/integration.module';
import { CMSIntegrationController } from './controller/cms/integration.controller';
import { ShipFeeModule } from './module/shipFee/shipFee.module';
import { CMSShipFeeController } from './controller/cms/shipFee.controller';
import { VipModule } from './module/vip/vip.module';
import { CMSVipController } from './controller/cms/vip.controller';
import { DataRecordModule } from './module/dataRecord/dataRecord.module';
import { CMSDataRecordController } from './controller/cms/dataRecord.controller';
import { UserRecordModule } from './module/userRecord/userRecord.module';
import { GoodRecordModule } from './module/goodRecord/goodRecord.module';
import { CategoryRecordModule } from './module/categoryRecord/categoryRecord.module';
import { CollectModule } from './module/collect/collect.module';
import { ApiCollectController } from './controller/api/collect.controller';
import { LogModule } from './module/logRecord/logRecord.module';
import { CMSLogController } from './controller/cms/log.controller';
// import锚点

@Module({
  imports: [
    ConfigModule,
    UtilModule,
    AuthModule,
    DatabaseModule,
    InitModule,
    AdminModule,
    CategoryModule,
    SpecificationModule,
    GoodModule,
    CarouselModule,
    UploadModule,
    MerchantModule,
    RechargeModule,
    UserModule,
    CartModule,
    AddressModule,
    OrderModule,
    ShipperModule,
    WeixinModule,
    ProductModule,
    FeedbackModule,
    RefundModule,
    ScheduleModule,
    CodeModule,
    NoticeModule,
    CouponModule,
    UserCouponModule,
    UserBalanceModule,
    IntegrationModule,
    ShipFeeModule,
    VipModule,
    DataRecordModule,
    UserRecordModule,
    GoodRecordModule,
    CategoryRecordModule,
    CollectModule,
    LogModule,
    // module锚点
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.redis,
      inject: [ConfigService]
    }),

  ],
  exports: [PaginationUtil],
  providers: [
    CryptoUtil,
    KDBirdUtil,
    QiniuUtil,
    PaginationUtil
  ],
  controllers: [
    CMSLoginController,
    CMSAdminController,
    CMSCategoryController,
    CMSSpecificationController,
    CMSGoodController,
    CMSCarouselController,
    CMSMerchantController,
    CMSRechargeController,
    CMSOrderController,
    CMSExpressController,
    CMSUserController,
    CMSProductController,
    CMSFeedbackController,
    CMSRefundController,
    CMSAddressController,
    CMSCodeController,
    ApiLoginController,
    ApiCategoryController,
    ApiCarouselController,
    ApiGoodController,
    ApiCartController,
    ApiAddressController,
    ApiOrderController,
    ApiMerchantController,
    ApiUserController,
    ApiFeedbackController,
    ApiExpressController,
    ApiRefundController,
    WeixinController,
    UploadController,
    CMSNoticeController,
    ApiNoticeController,
    CMSCouponController,
    ApiCouponController,
    CMSCommentController,
    CMSUserBalanceController,
    CMSIntegrationController,
    CMSShipFeeController,
    CMSVipController,
    CMSDataRecordController,
    ApiCollectController,
    CMSLogController,
    // controller锚点
  ]
})
export class AppModule { }
