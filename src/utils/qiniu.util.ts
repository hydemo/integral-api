import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';
import * as uuid from 'uuid/v4';
import { RedisService } from 'nestjs-redis';
import { ConfigService } from 'src/config/config.service';
import { Base64 } from 'js-base64';
import axios from 'axios';

@Injectable()
export class QiniuUtil {
	constructor(
		private readonly config: ConfigService,
		private readonly redis: RedisService,
	) {}

	/**
	 * 刷新七牛云token
	 *
	 */
	async refreshUpToken(): Promise<string> {
		const mac = new qiniu.auth.digest.Mac(
			this.config.qiniuAccessKey,
			this.config.qiniuSecretKey,
		);
		const options = {
			scope: this.config.qiniuBucket,
			expires: 7200,
		};
		const putPolicy = new qiniu.rs.PutPolicy(options);
		const uploadToken = putPolicy.uploadToken(mac);
		const client = this.redis.getClient();
		await client.set('qiniu_upToken', uploadToken, 'EX', 60 * 60 * 1.5);
		return uploadToken;
	}
	/**
	 * 获取七牛云token
	 *
	 */
	async getUpToken(): Promise<string> {
		const client = this.redis.getClient();
		const token = await client.get('qiniu_upToken');
		if (!token) {
			return this.refreshUpToken();
		}
		return token;
	}

	/**
	 * 刷新七牛云下载token
	 *
	 */
	async refreshDownToken(): Promise<string> {
		const mac = new qiniu.auth.digest.Mac(
			this.config.qiniuAccessKey,
			this.config.qiniuSecretKey,
		);
		const options = {
			scope: this.config.qiniuBucket,
			expires: 7200,
		};
		const putPolicy = new qiniu.rs.PutPolicy(options);
		const uploadToken = putPolicy.uploadToken(mac);
		const client = this.redis.getClient();
		await client.set('qiniu_upToken', uploadToken, 'EX', 60 * 60 * 1.5);
		return uploadToken;
	}

	/**
	 * 二进制上传
	 *
	 */
	async uploadByStream(data: any, type: string): Promise<any> {
		const config: any = new qiniu.conf.Config();
		config.zone = qiniu.zone.Zone_z2;
		const formUploader = new qiniu.form_up.FormUploader(config);
		const putExtra = new qiniu.form_up.PutExtra();
		const key = `${uuid()}.${type}`;
		const uploadToken = await this.getUpToken();
		return new Promise(resolve => {
			formUploader.putStream(
				uploadToken,
				key,
				data,
				putExtra,
				(respErr, respBody, respInfo) => {
					if (respErr) {
						resolve('');
					}
					if (respInfo.statusCode === 200) {
						return resolve(key);
					} else {
						return resolve('');
					}
				},
			);
		});
	}

	/**
	 * 上传base64文件到七牛云
	 *
	 * @param img 图片数据
	 */
	async uploadB64(img: string, type: string): Promise<string> {
		const token = await this.getUpToken();
		const key = Base64.encode(uuid() + '.' + type);
		const result: any = await axios({
			method: 'post',
			url: `http://up-z2.qiniup.com/putb64/-1/key/${key}`,
			data: img,
			headers: {
				// tslint:disable-next-line:object-literal-key-quotes
				Authorization: `UpToken ${token}`,
				'Content-Type': 'application/octet-stream',
			},
		}).catch(e => {});
		if (result.status === 200) {
			return result.data.key;
		}
		return '';
	}
}
