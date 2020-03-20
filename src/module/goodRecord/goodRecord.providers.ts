import { Connection } from 'mongoose';
import { GoodRecordSchema } from './goodRecord.schema';

export const goodRecordProviders = [
	{
		provide: 'GoodRecordModelToken',
		useFactory: (connection: Connection) =>
			connection.model('goodRecord', GoodRecordSchema),
		inject: ['MongoDBConnection'],
	},
];
