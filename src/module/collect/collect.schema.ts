import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const CollectSchema = new mongoose.Schema(
	{
		// 类型 1:商品 2:店铺
		bondType: { type: Number },
		// id
		bondToObjectId: { type: ObjectId },
		// 用户
		user: { type: ObjectId },
	},
	{ collection: 'collect', versionKey: false, timestamps: true },
);
