import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { couponProviders } from './coupon.providers';
import { CouponService } from './coupon.service';
import { UserCouponModule } from '../userCoupon/userCoupon.module';
import { UserModule } from '../user/user.module';

@Module({
	providers: [CouponService, ...couponProviders],
	exports: [CouponService],
	imports: [DatabaseModule, UserModule, UserCouponModule],
})
export class CouponModule {}
