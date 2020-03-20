import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const ServiceFeeSchema = new mongoose.Schema(
	{
		// 服务费汇总
		totalFee: { type: Number },
		// 服务费分发
		minusFee: { type: Number },
		// 关联id
		bondToObjectId: { type: ObjectId },
		// 关联类型 1:订单 2:积分赠送
		bondType: { type: Number },
	},
	{ collection: 'serviceFee', versionKey: false, timestamps: true },
);
