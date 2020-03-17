import { Connection } from 'mongoose';
// 引入schema
import { RechargeSchema } from './recharge.schema';

export const rechargesProviders = [
  {
    provide: 'RechargeModelToken',
    useFactory: (connection: Connection) => connection.model('recharge', RechargeSchema),
    inject: ['MongoDBConnection'],
  },
];