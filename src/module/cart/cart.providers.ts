import { Connection } from 'mongoose';
// 引入schema
import { CartSchema } from './cart.schema';

export const cartsProviders = [
	{
		provide: 'CartModelToken',
		useFactory: (connection: Connection) =>
			connection.model('cart', CartSchema),
		inject: ['MongoDBConnection'],
	},
];
