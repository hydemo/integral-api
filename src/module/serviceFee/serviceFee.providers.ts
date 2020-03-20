import { Connection } from 'mongoose';
import { ServiceFeeSchema } from './serviceFee.schema';

export const serviceFeeProviders = [
  {
    provide: 'ServiceFeeModelToken',
    useFactory: (connection: Connection) => connection.model('serviceFee', ServiceFeeSchema),
    inject: ['MongoDBConnection'],
  },
]