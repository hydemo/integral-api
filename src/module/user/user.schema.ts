import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const UserSchema = new mongoose.Schema(
	{
		// 注册时间
		registerTime: Date,
		// 注册ip
		registerIp: String,
		// 微信id
		weixinOpenid: { type: String },
		// 头像
		avatar: String,
		// 性别
		gender: Number,
		// 昵称
		nickname: String,
		// 最后登录时间
		lastLoginTime: Date,
		// 最后登录ip
		lastLoginIp: String,
		// 禁用时间
		blockTime: Date,
		// 禁用人
		blockBy: ObjectId,
		// 启用人
		unBlockBy: ObjectId,
		// 是否删除
		isBlock: { type: Boolean, default: false },
		// 用户余额
		balance: { type: Number, default: 0 },
		// 用户当前积分
		integration: { type: Number, default: 0 },
		// vip有效期
		vipExpire: { type: Date },
		// 是否新用户
		isNewUser: { type: Boolean, default: true },
		// 签到时间
		signTime: Date,
		// 是否实名认证
		isVerify: { type: Boolean, default: false },
		// 姓名
		realName: { type: String },
		// 手机号
		phone: { type: String, unique: true },
		// 身份证
		cardNumber: { type: String, unique: true },
		// 银行卡
		bankCard: { type: String },
		// 银行
		bank: { type: String },
		// 开户行
		bankAddress: { type: String },
		// 积分地址
		integrationAddress: { type: String },
		// 邀请人
		inviteBy: { type: ObjectId },
	},
	{ collection: 'user', versionKey: false, timestamps: true },
);
