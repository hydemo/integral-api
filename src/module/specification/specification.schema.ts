import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const SpecificationSchema = new mongoose.Schema(
  {
    // 规格名
    name: { type: String },
    // 创建人
    creator: ObjectId,
    // 是否删除
    isDelete: { type: Boolean, default: false },
    // 删除时间
    deleteTime: Date,
    // 排序
    sort: { type: Number },
  },
  { collection: 'specification', versionKey: false, timestamps: true },
);
