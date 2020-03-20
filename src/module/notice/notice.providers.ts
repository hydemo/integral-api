import { Connection } from 'mongoose';
import { NoticeSchema } from './notice.schema';

export const noticeProviders = [
	{
		provide: 'NoticeModelToken',
		useFactory: (connection: Connection) =>
			connection.model('notice', NoticeSchema),
		inject: ['MongoDBConnection'],
	},
];
