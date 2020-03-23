import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const AmbassadorCardSchema = new mongoose.Schema(
	{
		// 用户
		useBy: { type: ObjectId },
		// 等级
		level: { type: Number },
		// 是否使用
		isUsed: { type: Boolean, default: false },
		// 大使码
		key: { type: String },
		// 是否删除
		isDelete: { type: Boolean, default: false },
		// 删除时间
		deleteTime: { type: Date },
		// 删除人
		deleteBy: { type: ObjectId },
		// 创建人
		createBy: { type: ObjectId },
	},
	{ collection: 'ambassadorCard', versionKey: false, timestamps: true },
);
