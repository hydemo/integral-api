import { Connection } from 'mongoose';
import { FeedbackSchema } from './feedback.schema';

export const feedbacksProviders = [
  {
    provide: 'FeedbackModelToken',
    useFactory: (connection: Connection) => connection.model('Feedback', FeedbackSchema),
    inject: ['MongoDBConnection'],
  },
];