import { Connection } from 'mongoose';
// 引入schema
import { SpecificationSchema } from './specification.schema';

export const specificationsProviders = [
	{
		provide: 'SpecificationModelToken',
		useFactory: (connection: Connection) =>
			connection.model('specification', SpecificationSchema),
		inject: ['MongoDBConnection'],
	},
];
