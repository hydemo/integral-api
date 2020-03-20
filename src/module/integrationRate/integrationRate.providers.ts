import { Connection } from 'mongoose';
import { IntegrationRateSchema } from './integrationRate.schema';

export const integrationRateProviders = [
	{
		provide: 'IntegrationRateModelToken',
		useFactory: (connection: Connection) =>
			connection.model('integrationRate', IntegrationRateSchema),
		inject: ['MongoDBConnection'],
	},
];
