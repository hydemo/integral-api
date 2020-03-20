import { Connection } from 'mongoose';
// 引入schema
import { AddressSchema } from './address.schema';

export const addresssProviders = [
	{
		provide: 'AddressModelToken',
		useFactory: (connection: Connection) =>
			connection.model('address', AddressSchema),
		inject: ['MongoDBConnection'],
	},
];
