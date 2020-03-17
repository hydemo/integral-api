import { Connection } from 'mongoose';
// 引入schema
import { ProductSchema } from './product.schema';

export const productsProviders = [
  {
    provide: 'ProductModelToken',
    useFactory: (connection: Connection) => connection.model('product', ProductSchema),
    inject: ['MongoDBConnection'],
  },
];