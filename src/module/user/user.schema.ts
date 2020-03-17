import * as mongoose from 'mongoose';
import { ObjectId } from 'bson';

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
    // 用户当前积分
    integrationTotal: { type: Number, default: 0 },
    // 是否vip
    vip: { type: Number, default: 1 },
    // 是否新用户
    isNewUser: { type: Boolean, default: true },
    // 签到时间
    signTime: Date,
    // 默认提货点
    merchant: { type: ObjectId }
  },
  { collection: 'user', versionKey: false, timestamps: true },
);
