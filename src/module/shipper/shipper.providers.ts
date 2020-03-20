import { Connection } from 'mongoose';
// 引入schema
import { ShipperSchema } from './shipper.schema';

export const shippersProviders = [
	{
		provide: 'ShipperModelToken',
		useFactory: (connection: Connection) =>
			connection.model('shipper', ShipperSchema),
		inject: ['MongoDBConnection'],
	},
];
