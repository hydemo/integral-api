import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const GoodSchema = new mongoose.Schema(
	{
		// 商品名
		name: { type: String },
		// 商品货号
		goodSn: { type: String },
		// 创建人
		creator: ObjectId,
		// 分类
		category: [ObjectId],
		// 是否删除
		isDelete: { type: Boolean, default: false },
		// 删除时间
		deleteTime: Date,
		// 关键字
		keyword: { type: String },
		// 排序
		sort: { type: Number },
		// 摘要
		brief: { type: String },
		// 描述
		description: { type: String },
		// 描述图片
		descriptionPics: [String],
		// 是否上架
		onSale: { type: Boolean, default: true },
		// 销量
		sellVolumn: { type: Number, default: 0 },
		// 是否热销
		isHot: { type: Boolean, default: false },
		// 是否限时销售
		isLimit: { type: Boolean, default: false },
		// 限时开始时间
		limitStartTime: { type: Date },
		// 限时结束时间
		limitEndTime: { type: Date },
		// 促销方式 1:扣减金额 2折扣
		promotionType: { type: Number, enmu: [1, 2] },
		// 促销方式 1:扣减金额 2折扣
		promotionValue: { type: Number },
		// 图片列表
		images: [String],
		// 是否预售
		preSale: { type: Boolean, default: false },
		// 预售方式 1:扣减金额 2折扣
		preSaleType: { type: Number, enmu: [1, 2] },
		// 预售值 1:扣减金额 2折扣
		preSaleValue: { type: Number },
		// 预售截止日期
		preSaleEndTime: { type: Date },
		// 预售预计发货日期
		preSaleSendTime: { type: Date },
		// 折扣
		discount: { type: Number },
		// 是否新人专享
		isNewUser: { type: Boolean, default: false },
		// 审核状态啊
		checkResult: { type: Number, enum: [1, 2, 3], default: 2 },
		// 上架推广人
		recommendUser: { type: ObjectId },
	},
	{ collection: 'good', versionKey: false, timestamps: true },
);
