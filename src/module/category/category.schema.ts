import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const CategorySchema = new mongoose.Schema(
  {
    // 分类名
    name: { type: String },
    // 创建人
    creator: ObjectId,
    // 类别
    showOnTop: { type: Boolean, default: true },
    // 是否删除
    isDelete: { type: Boolean, default: false },
    // 删除时间
    deleteTime: Date,
    // logo
    logo: String,
    // 关键字
    keyword: { type: String },
    // 排序
    sort: { type: Number },
    // 父级分类
    parent: { type: ObjectId },
    // 分类级别
    layer: { type: Number, enum: [1, 2] }
  },
  { collection: 'category', versionKey: false, timestamps: true },
);
