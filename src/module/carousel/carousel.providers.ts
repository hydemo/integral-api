import { Connection } from 'mongoose';
// 引入schema
import { CarouselSchema } from './carousel.schema';

export const carouselsProviders = [
  {
    provide: 'CarouselModelToken',
    useFactory: (connection: Connection) => connection.model('carousel', CarouselSchema),
    inject: ['MongoDBConnection'],
  },
];