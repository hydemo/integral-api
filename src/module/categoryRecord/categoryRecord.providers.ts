import { Connection } from 'mongoose';
import { CategoryRecordSchema } from './categoryRecord.schema';

export const categoryRecordProviders = [
	{
		provide: 'CategoryRecordModelToken',
		useFactory: (connection: Connection) =>
			connection.model('categoryRecord', CategoryRecordSchema),
		inject: ['MongoDBConnection'],
	},
];
