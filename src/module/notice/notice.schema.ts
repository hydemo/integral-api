import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const NoticeSchema = new mongoose.Schema(
  {
    // 姓名
    name: { type: String },
    // 手机号
    phone: { type: String },
    // 微信openId
    openId: { type: String },
    // 是否微信通知
    isWeixinNotice: { type: Boolean, default: false },
    // 是否手机通知
    isPhoneNotice: { type: Boolean, default: true },
    // 是否删除
    isDelete: { type: Boolean, default: false },
    // 删除时间
    deleteTime: { type: Date },
    // 删除人
    deleteBy: { type: ObjectId },
    // 创建人
    createBy: { type: ObjectId },
  },
  { collection: 'notice', versionKey: false, timestamps: true },
);