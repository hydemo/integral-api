import { Connection } from 'mongoose';
// 引入schema
import { UserBalanceSchema } from './userBalance.schema';

export const userBalancesProviders = [
  {
    provide: 'UserBalanceModelToken',
    useFactory: (connection: Connection) => connection.model('userBalance', UserBalanceSchema),
    inject: ['MongoDBConnection'],
  },
];