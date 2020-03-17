import { Connection } from 'mongoose';
import { VipSchema } from './vip.schema';

export const vipProviders = [
  {
    provide: 'VipModelToken',
    useFactory: (connection: Connection) => connection.model('vip', VipSchema),
    inject: ['MongoDBConnection'],
  },
]