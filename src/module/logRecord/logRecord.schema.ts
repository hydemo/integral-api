import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const LogSchema = new mongoose.Schema(
	{
		// 用户
		user: { type: ObjectId },
		// 请求方法
		method: { type: String, enum: ['PUT', 'POST', 'DELETE'] },
		// 接口
		interface: { type: String },
		// 接口
		ip: { type: String },
		// 模块
		module: { type: String },
		// 描述
		description: { type: String },
		// 修改id
		bondToObjectId: { type: ObjectId },
	},
	{ collection: 'log', versionKey: false, timestamps: true },
);
