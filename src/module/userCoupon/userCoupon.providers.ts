import { Connection } from 'mongoose';
import { UserCouponSchema } from './userCoupon.schema';

export const userCouponProviders = [
  {
    provide: 'UserCouponModelToken',
    useFactory: (connection: Connection) => connection.model('userCoupon', UserCouponSchema),
    inject: ['MongoDBConnection'],
  },
]