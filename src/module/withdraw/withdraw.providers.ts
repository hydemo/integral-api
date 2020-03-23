import { Connection } from 'mongoose';
import { WithdrawSchema } from './withdraw.schema';

export const withdrawProviders = [
  {
    provide: 'WithdrawModelToken',
    useFactory: (connection: Connection) => connection.model('withdraw', WithdrawSchema),
    inject: ['MongoDBConnection'],
  },
]