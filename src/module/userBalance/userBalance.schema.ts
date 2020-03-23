import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const UserBalanceSchema = new mongoose.Schema(
	{
		// 来源
		sourceId: ObjectId,
		// 来源类型 1:退货退款积分返还 2:积分兑换 3:提现
		sourceType: { type: Number, enum: [1, 2, 3] },
		// 内容
		amount: Number,
		// 收包人
		user: ObjectId,
		// 类型
		type: { type: String, enum: ['add', 'minus'] },
	},
	{ collection: 'userBalance', versionKey: false, timestamps: true },
);
