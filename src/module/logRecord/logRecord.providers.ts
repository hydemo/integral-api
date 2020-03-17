import { Connection } from 'mongoose';
import { LogSchema } from './logRecord.schema';

export const logProviders = [
  {
    provide: 'LogModelToken',
    useFactory: (connection: Connection) => connection.model('log', LogSchema),
    inject: ['MongoDBConnection'],
  },
]