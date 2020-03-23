import { Connection } from 'mongoose';
import { AmbassadorRateSchema } from './ambassadorRate.schema';

export const ambassadorRateProviders = [
  {
    provide: 'AmbassadorRateModelToken',
    useFactory: (connection: Connection) => connection.model('ambassadorRate', AmbassadorRateSchema),
    inject: ['MongoDBConnection'],
  },
]