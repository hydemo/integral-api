import { Connection } from 'mongoose';
import { IntegrationSchema } from './integration.schema';

export const integrationProviders = [
  {
    provide: 'IntegrationModelToken',
    useFactory: (connection: Connection) => connection.model('integration', IntegrationSchema),
    inject: ['MongoDBConnection'],
  },
]