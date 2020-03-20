import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { userCouponProviders } from './userCoupon.providers';
import { UserCouponService } from './userCoupon.service';

@Module({
	providers: [UserCouponService, ...userCouponProviders],
	exports: [UserCouponService],
	imports: [DatabaseModule],
})
export class UserCouponModule {}
