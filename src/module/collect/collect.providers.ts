import { Connection } from 'mongoose';
import { CollectSchema } from './collect.schema';

export const collectProviders = [
  {
    provide: 'CollectModelToken',
    useFactory: (connection: Connection) => connection.model('collect', CollectSchema),
    inject: ['MongoDBConnection'],
  },
]