import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const ProductSchema = new mongoose.Schema(
	{
		// 规格表
		specifications: [String],
		// 指针
		indicator: String,
		// 图片
		pic: String,
		// 原价
		realPrice: Number,
		// 折扣价
		discountPrice: Number,
		// 促销价
		promotionPrice: Number,
		// 预售价
		preSalePrice: Number,
		// 库存
		stock: Number,
		// 库存预警
		stockAlarm: { type: Number, default: 10 },
		// 商品id
		good: String,
		// 是否删除
		isDelete: { type: Boolean, default: false },
		// 删除时间
		deleteTime: Date,
		// 销量
		sellVolumn: { type: Number, default: 0 },
		// 销量
		sellVolumnToShow: { type: String },
		// 服务费
		serviceFee: { type: Number },
	},
	{ collection: 'product', versionKey: false, timestamps: true },
);
