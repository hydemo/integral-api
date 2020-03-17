import { Document } from 'mongoose';

export interface IFeedback extends Document {
  // 评论内容
  content: string;
  // 评论人
  user: string;
  // 图片
  images: string[];
}