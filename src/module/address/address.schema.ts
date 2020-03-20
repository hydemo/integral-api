import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const AddressSchema = new mongoose.Schema(
	{
		// 类型
		type: { type: String, enum: ['user', 'merchant'], default: 'user' },
		// 用户
		user: ObjectId,
		// 收货人
		consignee: String,
		// 手机号
		phone: String,
		// 国家
		country: String,
		// 省份
		province: String,
		// 市
		city: String,
		// 地区
		district: String,
		// 地址
		address: String,
		// 是否默认
		isDefault: { type: Boolean, default: true },
	},
	{ collection: 'address', versionKey: false, timestamps: true },
);
