import { Connection } from 'mongoose';
// 引入schema
import { RefundSchema } from './refund.schema';

export const refundsProviders = [
  {
    provide: 'RefundModelToken',
    useFactory: (connection: Connection) => connection.model('refund', RefundSchema),
    inject: ['MongoDBConnection'],
  },
];