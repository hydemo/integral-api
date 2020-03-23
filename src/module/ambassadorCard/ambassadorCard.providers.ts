import { Connection } from 'mongoose';
import { AmbassadorCardSchema } from './ambassadorCard.schema';

export const ambassadorCardProviders = [
  {
    provide: 'AmbassadorCardModelToken',
    useFactory: (connection: Connection) => connection.model('ambassadorCard', AmbassadorCardSchema),
    inject: ['MongoDBConnection'],
  },
]