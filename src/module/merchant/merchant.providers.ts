import { Connection } from 'mongoose';
// 引入schema
import { MerchantSchema } from './merchant.schema';

export const merchantsProviders = [
  {
    provide: 'MerchantModelToken',
    useFactory: (connection: Connection) => connection.model('merchant', MerchantSchema),
    inject: ['MongoDBConnection'],
  },
];