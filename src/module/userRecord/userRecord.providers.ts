import { Connection } from 'mongoose';
import { UserRecordSchema } from './userRecord.schema';

export const userRecordProviders = [
  {
    provide: 'UserRecordModelToken',
    useFactory: (connection: Connection) => connection.model('userRecord', UserRecordSchema),
    inject: ['MongoDBConnection'],
  },
]