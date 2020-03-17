import { Connection } from 'mongoose';
import { DataRecordSchema } from './dataRecord.schema';

export const dataRecordProviders = [
  {
    provide: 'DataRecordModelToken',
    useFactory: (connection: Connection) => connection.model('dataRecord', DataRecordSchema),
    inject: ['MongoDBConnection'],
  },
]