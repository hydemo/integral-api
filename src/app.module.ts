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
import { CMSVipCardController } from './controller/cms/vipCard.controller';
import { VipCardModule } from './module/vipCard/vipCard.module';
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
import { ApiUserController } from './controller/api/user.controller';
import { PaginationUtil } from './utils/pagination.util';
import { UtilModule } from './utils/util.module';
import { ConfigModule } from './config/config.module';
import { ProductModule } from './module/product/product.module';
import { CMSProductController } from './controller/cms/product.controller';
import { CMSRefundController } from './controller/cms/refund.controller';
import { RefundModule } from './module/refund/refund.module';
import { ApiExpressController } from './controller/api/express.controller';
import { ApiRefundController } from './controller/api/refund.controller';
import { ScheduleModule } from './schedule/schedule.module';
import { CodeModule } from './module/code/code.module';
import { CMSCodeController } from './controller/cms/code.controller';
import { NoticeModule } from './module/notice/notice.module';
import { CMSNoticeController } from './controller/cms/notice.controller';
import { ApiNoticeController } from './controller/api/notice.controller';
import { CMSCommentController } from './controller/cms/comment.controller';
import { CMSUserBalanceController } from './controller/cms/userBalance.controller';
import { UserBalanceModule } from './module/userBalance/userBalance.module';
import { IntegrationModule } from './module/integration/integration.module';
import { CMSIntegrationController } from './controller/cms/integration.controller';
import { ShipFeeModule } from './module/shipFee/shipFee.module';
import { DataRecordModule } from './module/dataRecord/dataRecord.module';
import { CMSDataRecordController } from './controller/cms/dataRecord.controller';
import { UserRecordModule } from './module/userRecord/userRecord.module';
import { GoodRecordModule } from './module/goodRecord/goodRecord.module';
import { CategoryRecordModule } from './module/categoryRecord/categoryRecord.module';
import { CollectModule } from './module/collect/collect.module';
import { ApiCollectController } from './controller/api/collect.controller';
import { LogModule } from './module/logRecord/logRecord.module';
import { CMSLogController } from './controller/cms/log.controller';
import { IntegrationSummaryModule } from './module/integrationSummary/integrationSummary.module';
import { CMSIntegrationSummaryController } from './controller/cms/integrationSummary.controller';
import { IntegrationRateModule } from './module/integrationRate/integrationRate.module';
import { CMSIntegrationRateController } from './controller/cms/integrationRate.controller';
import { ServiceFeeModule } from './module/serviceFee/serviceFee.module';
import { CMSServiceFeeController } from './controller/cms/serviceFee.controller';
import { CMSAddressController } from './controller/cms/address.controller';
import { WithdrawModule } from './module/withdraw/withdraw.module';
import { CMSWithdrawController } from './controller/cms/withdraw.controller';
import { AmbassadorCardModule } from './module/ambassadorCard/ambassadorCard.module';
import { CMSAmbassadorCardController } from './controller/cms/ambassadorCard.controller';
import { AmbassadorRateModule } from './module/ambassadorRate/ambassadorRate.module';
import { CMSAmbassadorRateController } from './controller/cms/ambassadorRate.controller';
import { ApiIntegrationController } from './controller/api/integration.controller';
import { WeixinQrcodeModule } from './module/weixinQrcode/weixinQrcode.module';
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
		VipCardModule,
		UserModule,
		CartModule,
		AddressModule,
		OrderModule,
		ShipperModule,
		WeixinModule,
		ProductModule,
		RefundModule,
		ScheduleModule,
		CodeModule,
		NoticeModule,
		UserBalanceModule,
		IntegrationModule,
		ShipFeeModule,
		DataRecordModule,
		UserRecordModule,
		GoodRecordModule,
		CategoryRecordModule,
		CollectModule,
		LogModule,
		IntegrationSummaryModule,
		IntegrationRateModule,
		ServiceFeeModule,
		WithdrawModule,
		AmbassadorCardModule,
		AmbassadorRateModule,
		WeixinQrcodeModule,
		// module锚点
		PassportModule.register({ defaultStrategy: 'jwt' }),
		RedisModule.forRootAsync({
			useFactory: (configService: ConfigService) => configService.redis,
			inject: [ConfigService],
		}),
	],
	exports: [PaginationUtil],
	providers: [CryptoUtil, KDBirdUtil, QiniuUtil, PaginationUtil],
	controllers: [
		CMSLoginController,
		CMSAdminController,
		CMSCategoryController,
		CMSSpecificationController,
		CMSGoodController,
		CMSCarouselController,
		CMSVipCardController,
		CMSOrderController,
		CMSExpressController,
		CMSUserController,
		CMSProductController,
		CMSRefundController,
		CMSCodeController,
		ApiLoginController,
		ApiCategoryController,
		ApiCarouselController,
		ApiGoodController,
		ApiCartController,
		ApiAddressController,
		ApiOrderController,
		ApiUserController,
		ApiExpressController,
		ApiRefundController,
		WeixinController,
		UploadController,
		CMSNoticeController,
		ApiNoticeController,
		CMSCommentController,
		CMSUserBalanceController,
		CMSIntegrationController,
		CMSDataRecordController,
		ApiCollectController,
		CMSLogController,
		CMSIntegrationSummaryController,
		CMSIntegrationRateController,
		CMSServiceFeeController,
		CMSAddressController,
		CMSWithdrawController,
		CMSAmbassadorCardController,
		CMSAmbassadorRateController,
		ApiIntegrationController,
		// controller锚点
	],
})
export class AppModule {}
