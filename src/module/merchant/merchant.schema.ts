import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const MerchantSchema = new mongoose.Schema(
  {
    // 店名
    name: String,
    // logo
    logo: String,
    // 店长
    owner: String,
    // 手机号
    phone: String,
    // 地址
    address: String,
    // 地图
    addressPic: [String],
    // 创建人
    creator: ObjectId,
    // 是否删除
    isDelete: { type: Boolean, default: false },
    // 删除时间
    deleteTime: Date,
    // 经度
    longitude: { type: Number },
    // 纬度
    latitude: { type: Number },
    // 类型
    type: { type: Number, enum: [1, 2, 3], default: 1 }
  },
  { collection: 'merchant', versionKey: false, timestamps: true },
);
