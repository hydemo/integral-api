import { Model } from 'mongoose';
import * as stream from 'stream';
import * as fs from 'fs';
import { Inject, Injectable } from '@nestjs/common';
import { CreateWeixinQrcodeDTO } from './weixinQrcode.dto';
import { IWeixinQrcode } from './weixinQrcode.interfaces';
import { QiniuUtil } from 'src/utils/qiniu.util';
import { WeixinUtil } from 'src/utils/weixin.util';

@Injectable()
export class WeixinQrcodeService {
	constructor(
		@Inject('WeixinQrcodeModelToken')
		private readonly weixinQrcodeModel: Model<IWeixinQrcode>,
		@Inject(QiniuUtil)
		private readonly qiniuUtil: QiniuUtil,
		@Inject(WeixinUtil)
		private readonly weixinUtil: WeixinUtil,
	) {}

	// 创建数据
	async create(weixinQrcode: CreateWeixinQrcodeDTO): Promise<string> {
		const { user, bondToObjectId, page = 'pages/index/index' } = weixinQrcode;
		const exist = await this.weixinQrcodeModel.findOne({
			user,
			bondToObjectId,
			page,
		});
		if (exist) {
			return exist.url;
		}
		const newWeixinQrcode = await this.weixinQrcodeModel.create({
			...weixinQrcode,
			page,
		});
		const qrcode: any = await this.weixinUtil.qrCode(newWeixinQrcode._id, page);
		const img = new Buffer(qrcode, 'binary').toString('base64');
		const url = await this.qiniuUtil.uploadB64(img, 'jpg');
		if (url) {
			await this.weixinQrcodeModel.findByIdAndUpdate(newWeixinQrcode._id, {
				url,
			});
		} else {
			await this.weixinQrcodeModel.findByIdAndDelete(newWeixinQrcode._id);
		}
		return url;
	}

	// 创建数据
	async findOne(
		user: string,
		bondToObjectId: string,
	): Promise<IWeixinQrcode | null> {
		return await this.weixinQrcodeModel.findOne({
			user,
			bondToObjectId,
		});
	}
}
