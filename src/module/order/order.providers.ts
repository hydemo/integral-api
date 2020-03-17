import { Connection } from 'mongoose';
// 引入schema
import { OrderSchema } from './order.schema';

export const ordersProviders = [
  {
    provide: 'OrderModelToken',
    useFactory: (connection: Connection) => connection.model('order', OrderSchema),
    inject: ['MongoDBConnection'],
  },
];