import { Connection } from 'mongoose';
import { IntegrationSummarySchema } from './integrationSummary.schema';

export const integrationSummaryProviders = [
	{
		provide: 'IntegrationSummaryModelToken',
		useFactory: (connection: Connection) =>
			connection.model('integrationSummary', IntegrationSummarySchema),
		inject: ['MongoDBConnection'],
	},
];
