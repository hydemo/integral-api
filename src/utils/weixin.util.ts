import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as md5 from 'md5';
import * as fs from 'fs';
import * as tenpay from 'tenpay';
import axios from 'axios';
import * as WeiXinPay from 'weixinpay';
import * as rp from 'request-promise';
import { ConfigService } from '@config/config.service';
import { LoginDTO } from 'src/module/user/login.dto';
import { IPayInfo } from 'src/common/interface/payInfo.interface';
import { RedisService } from 'nestjs-redis';
import { ApplicationDTO } from 'src/common/dto/Message.dto';

@Injectable()
export class WeixinUtil {
	constructor(
		private readonly config: ConfigService,
		private readonly redis: RedisService,
	) {}
	async login(code: string, login: LoginDTO): Promise<any> {
		try {
			const options = {
				method: 'GET',
				url: 'https://api.weixin.qq.com/sns/jscode2session',
				qs: {
					grant_type: 'authorization_code',
					js_code: code,
					secret: this.config.secret,
					appid: this.config.appid,
				},
			};

			let sessionData = await rp(options);
			sessionData = JSON.parse(sessionData);
			if (!sessionData.openid) {
				return null;
			}
			// 验证用户信息完整性
			const sha1 = crypto
				.createHash('sha1')
				.update(login.rawData.toString() + sessionData.session_key)
				.digest('hex');
			if (login.signature !== sha1) {
				return null;
			}

			// 解析用户数据
			const wechatUserInfo = await this.decryptUserInfoData(
				sessionData.session_key,
				login.encryptedData,
				login.iv,
			);
			if (!wechatUserInfo) {
				return null;
			}
			return wechatUserInfo;
		} catch (e) {
			return null;
		}
	}

	/**
	 * 解析微信登录用户数据
	 * @param sessionKey
	 * @param encryptedData
	 * @param iv
	 * @returns {Promise.<any>}
	 */
	async decryptUserInfoData(
		sessionKey: string,
		encryptedData: string,
		iv: string,
	): Promise<any> {
		let decoded = '';
		try {
			const _sessionKey = new Buffer(sessionKey, 'base64');
			const _encryptedData = new Buffer(encryptedData, 'base64');
			const _iv = new Buffer(iv, 'base64');
			// 解密
			const decipher = crypto.createDecipheriv('aes-128-cbc', _sessionKey, _iv);
			// 设置自动 padding 为 true，删除填充补位
			decipher.setAutoPadding(true);
			decoded = decipher.update(_encryptedData, 'binary', 'utf8');
			decoded += decipher.final('utf8');
			const userInfo = JSON.parse(decoded);
			if (userInfo.watermark.appid !== this.config.appid) {
				return null;
			}
			return userInfo;
		} catch (err) {
			return null;
		}
	}

	/**
	 * 统一下单
	 * @param payInfo
	 * @returns {Promise}
	 */
	async createUnifiedOrder(payInfo: IPayInfo) {
		const weixinpay = new WeiXinPay({
			appid: this.config.appid, // 微信小程序appid
			openid: payInfo.openId, // 用户openid
			mch_id: this.config.mchId, // 商户帐号ID
			partner_key: this.config.partnerKey, // 秘钥
		});
		const trade_type = 'JSAPI';
		return new Promise((resolve, reject) => {
			weixinpay.createUnifiedOrder(
				{
					body: '购买商品',
					out_trade_no: String(payInfo.orderId),
					total_fee: Number((payInfo.fee * 100).toFixed(0)),
					// total_fee: 1,
					spbill_create_ip: this.config.spbillCreatIp,
					notify_url: this.config.notifyUrl,
					trade_type,
				},
				res => {
					if (res.return_code === 'SUCCESS' && res.result_code === 'SUCCESS') {
						const returnParams: any = {
							appid: res.appid,
							timeStamp: parseInt((Date.now() / 1000).toString(), 10) + '',
							nonceStr: res.nonce_str,
							package: 'prepay_id=' + res.prepay_id,
							signType: 'MD5',
							code_url: res.code_url,
						};
						const paramStr = `appId=${returnParams.appid}&nonceStr=${
							returnParams.nonceStr
						}&package=${returnParams.package}&signType=${
							returnParams.signType
						}&timeStamp=${returnParams.timeStamp}&key=${
							this.config.partnerKey
						}`;
						returnParams.paySign = md5(paramStr).toUpperCase();
						resolve(returnParams);
					} else {
						reject(res);
					}
				},
			);
		});
	}

	/**
	 * 生成排序后的支付参数 query
	 * @param queryObj
	 * @returns {Promise.<string>}
	 */
	buildQuery(queryObj) {
		const sortPayOptions = {};
		for (const key of Object.keys(queryObj).sort()) {
			sortPayOptions[key] = queryObj[key];
		}
		let payOptionQuery = '';
		for (const key of Object.keys(sortPayOptions).sort()) {
			payOptionQuery += key + '=' + sortPayOptions[key] + '&';
		}
		payOptionQuery = payOptionQuery.substring(0, payOptionQuery.length - 1);
		return payOptionQuery;
	}

	/**
	 * 对 query 进行签名
	 * @param queryStr
	 * @returns {Promise.<string>}
	 */
	signQuery(queryStr) {
		queryStr = queryStr + '&key=' + this.config.partnerKey;
		const md5Sign = md5(queryStr);
		return md5Sign.toUpperCase();
	}

	/**
	 * 处理微信支付回调
	 * @param notifyData
	 * @returns {{}}
	 */
	payNotify(notifyData: any) {
		if (!notifyData) {
			return false;
		}

		const notifyObj: any = {};
		let sign = '';
		for (const key of Object.keys(notifyData)) {
			if (key !== 'sign') {
				notifyObj[key] = notifyData[key];
			} else {
				sign = notifyData[key];
			}
		}
		if (
			notifyObj.return_code !== 'SUCCESS' ||
			notifyObj.result_code !== 'SUCCESS'
		) {
			return false;
		}

		const signString = this.signQuery(this.buildQuery(notifyObj));
		if (!sign || signString !== sign) {
			return false;
		}
		return notifyObj;
	}

	/**
	 * 查询订单
	 * @param query
	 * @returns {Promise}
	 */
	async queryOrdersByCondition(id: string) {
		const weixinpay = new WeiXinPay({
			appid: this.config.appid, // 微信小程序appid
			// openid: payInfo.openId, // 用户openid
			mch_id: this.config.mchId, // 商户帐号ID
			partner_key: this.config.partnerKey, // 秘钥
		});
		return new Promise((resolve, reject) => {
			weixinpay.queryOrder(
				{
					transaction_id: id,
				},
				res => {
					if (res.return_code === 'SUCCESS' && res.result_code === 'SUCCESS') {
						resolve(res);
					} else {
						reject(res);
					}
				},
			);
		});
	}

	/**
	 * 提现
	 * @param withdraw
	 * @returns {Promise}
	 */
	async withdraw(fee: number, openId: string, withdraw: string) {
		const pfx = fs.readFileSync('apiclient_cert.p12');
		const config = {
			appid: this.config.appid,
			mchid: this.config.mchId,
			partnerKey: this.config.partnerKey,
			pfx,
			notify_url: this.config.refundNotifyUrl,
			spbill_create_ip: '39.98.52.69',
		};
		const api = new tenpay(config);
		try {
			const result = await api.transfers({
				check_name: 'NO_CHECK',
				partner_trade_no: String(withdraw),
				openid: openId,
				amount: Number((fee * 100).toFixed(0)),
				desc: '嗨猪精选退款',
			});
			if (result.return_code === 'SUCCESS') {
				return result;
			} else {
				return false;
			}
		} catch (error) {
			return false;
		}
	}

	/**
	 * 提现
	 * @param  fee 费用
	 * @param openId 用户openId
	 * @param id 退款单号id
	 * @returns {Promise}
	 */
	async refund(
		fee: number,
		totalFee: number,
		openId: string,
		order: string,
		refund: string,
	) {
		const pfx = fs.readFileSync('apiclient_cert.p12');
		const config = {
			appid: this.config.appid,
			mchid: this.config.mchId,
			partnerKey: this.config.partnerKey,
			pfx,
			notify_url: this.config.notifyUrl,
			spbill_create_ip: '39.98.52.69',
		};
		const api = new tenpay(config);
		try {
			const result = await api.refund({
				// transaction_id, out_trade_no 二选一
				// transaction_id: '微信的订单号',
				out_trade_no: String(order),
				out_refund_no: String(refund),
				total_fee: Number((totalFee * 100).toFixed(0)),
				// total_fee: 1,
				// refund_fee: 1,
				refund_fee: Number((fee * 100).toFixed(0)),
			});
			// console.log(result, 'aa')
			if (result.return_code === 'SUCCESS') {
				return result;
			} else {
				return false;
			}
		} catch (error) {
			// console.log(error, 'error')
			return false;
		}
	}

	/**
	 * 获取微信access_token
	 */
	async access_token(): Promise<string> {
		const client = this.redis.getClient();
		const access_token = await client.get('weixin_accessToken');
		if (access_token) {
			return access_token;
		}
		const result = await axios({
			method: 'get',
			url: 'https://api.weixin.qq.com/cgi-bin/token',
			params: {
				grant_type: 'client_credential',
				appid: this.config.gzhAppid,
				secret: this.config.gzhAppSecret,
			},
		});
		await client.set(
			'weixin_accessToken',
			result.data.access_token,
			'EX',
			60 * 60 * 1.5,
		);
		return result.data.access_token;
	}

	// 授权登录
	async oauth(code: string): Promise<string | null> {
		const result = await axios({
			method: 'get',
			url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
			params: {
				appid: this.config.gzhAppid,
				secret: this.config.gzhAppSecret,
				code,
				grant_type: 'authorization_code',
			},
		});
		if (result && result.data && result.data.access_token) {
			return result.data.openid;
		}
		return null;
	}

	// 发送短信通知
	async sendNoticeMessage(openId: string, data: ApplicationDTO) {
		const token = await this.access_token();
		await axios({
			method: 'post',
			url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`,
			data: {
				touser: openId,
				template_id: this.config.noticeModel,
				data,
			},
		}).catch(e => {});
	}
}
