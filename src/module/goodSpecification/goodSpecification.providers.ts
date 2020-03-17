import { Connection } from 'mongoose';
// 引入schema
import { GoodSpecificationSchema } from './goodSpecification.schema';

export const goodSpecificationsProviders = [
  {
    provide: 'GoodSpecificationModelToken',
    useFactory: (connection: Connection) => connection.model('goodSpecification', GoodSpecificationSchema),
    inject: ['MongoDBConnection'],
  },
];