import { Connection } from 'mongoose';
// 引入schema
import { CategorySchema } from './category.schema';

export const categorysProviders = [
	{
		provide: 'CategoryModelToken',
		useFactory: (connection: Connection) =>
			connection.model('category', CategorySchema),
		inject: ['MongoDBConnection'],
	},
];
