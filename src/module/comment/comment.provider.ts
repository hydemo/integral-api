import { Connection } from 'mongoose';
import { CommentSchema } from './comment.schema';

export const commentsProviders = [
	{
		provide: 'CommentModelToken',
		useFactory: (connection: Connection) =>
			connection.model('Comment', CommentSchema),
		inject: ['MongoDBConnection'],
	},
];
