import { Connection } from 'mongoose';
// 引入schema
import { MerchantBillSchema } from './merchantBill.schema';

export const merchantBillsProviders = [
  {
    provide: 'MerchantBillModelToken',
    useFactory: (connection: Connection) => connection.model('merchantBill', MerchantBillSchema),
    inject: ['MongoDBConnection'],
  },
];