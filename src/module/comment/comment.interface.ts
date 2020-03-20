import { Document } from 'mongoose';

export interface IComment extends Document {
	// 评论内容
	readonly content: string;
	// 点赞数
	readonly starCount?: number;
	// 评论人
	commentator?: string;
	// 评论时间
	readonly commentTime: Date;
	// 评论类型
	readonly boundType: string;
	// 评论对象id
	readonly boundToObjectId: string;
	// 图片
	readonly images: string[];
	// 评分
	readonly score: number;
	// 是否匿名
	readonly anonymous: boolean;
	// 后台反馈
	readonly feedback: string;
}
