import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const WithdrawSchema = new mongoose.Schema(
	{
		// 用户
		user: { type: ObjectId },
		// 提现金额
		amount: { type: Number },
		// 审核状态
		checkResult: { type: Number, enum: [1, 2, 3] },
		// 审核人
		reviewer: { type: ObjectId },
	},
	{ collection: 'withdraw', versionKey: false, timestamps: true },
);
