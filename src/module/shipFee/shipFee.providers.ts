import { Connection } from 'mongoose';
import { ShipFeeSchema } from './shipFee.schema';

export const shipFeeProviders = [
	{
		provide: 'ShipFeeModelToken',
		useFactory: (connection: Connection) =>
			connection.model('shipFee', ShipFeeSchema),
		inject: ['MongoDBConnection'],
	},
];
