import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const WeixinQrcodeSchema = new mongoose.Schema(
	{
		// 用户
		user: { type: ObjectId },
		// 来源id
		bondToObjectId: { type: ObjectId },
		// 来源类型 1:商品
		bondType: { type: Number, enum: [1] },
		// 二维码地址
		url: { type: String },
		// 链接路径
		path: { type: String },
	},
	{ collection: 'weixinQrcode', versionKey: false, timestamps: true },
);
