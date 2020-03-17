import { Connection } from 'mongoose';
import { CouponSchema } from './coupon.schema';

export const couponProviders = [
  {
    provide: 'CouponModelToken',
    useFactory: (connection: Connection) => connection.model('coupon', CouponSchema),
    inject: ['MongoDBConnection'],
  },
]