import { Connection } from 'mongoose';
import { WeixinQrcodeSchema } from './weixinQrcode.schema';

export const weixinQrcodeProviders = [
  {
    provide: 'WeixinQrcodeModelToken',
    useFactory: (connection: Connection) => connection.model('weixinQrcode', WeixinQrcodeSchema),
    inject: ['MongoDBConnection'],
  },
]