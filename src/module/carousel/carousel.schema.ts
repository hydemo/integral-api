import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const CarouselSchema = new mongoose.Schema(
	{
		// 类型 1:首页顶部 2:首页中部 3:本地服务 4:在线商城
		type: { type: Number, enum: [1, 2, 3, 4], default: 1 },
		// 创建人
		creator: ObjectId,
		// 是否删除
		isDelete: { type: Boolean, default: false },
		// 删除时间
		deleteTime: Date,
		// 图片
		imgUrl: { type: String },
		// 图片
		sort: { type: Number },
		// 图片链接
		imgLink: { type: String },
		// 绑定类型 1:商品 2:外链 3:小程序
		bondType: { type: Number, enum: [1, 2, 3], default: 1 },
		// 绑定id
		bondToObjectId: { type: ObjectId },
	},
	{ collection: 'carousel', versionKey: false, timestamps: true },
);
