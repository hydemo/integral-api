import { Connection } from 'mongoose';
// 引入schema
import { VipCardSchema } from './vipCard.schema';

export const vipCardsProviders = [
	{
		provide: 'VipCardModelToken',
		useFactory: (connection: Connection) =>
			connection.model('vipCard', VipCardSchema),
		inject: ['MongoDBConnection'],
	},
];
