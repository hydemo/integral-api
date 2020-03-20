import { Connection } from 'mongoose';
// 引入schema
import { GoodSchema } from './good.schema';

export const goodsProviders = [
	{
		provide: 'GoodModelToken',
		useFactory: (connection: Connection) =>
			connection.model('good', GoodSchema),
		inject: ['MongoDBConnection'],
	},
];
