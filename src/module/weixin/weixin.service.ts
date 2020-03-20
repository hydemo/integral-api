import { WeixinUtil } from 'src/utils/weixin.util';
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { OrderService } from '../order/order.service';
import { IOrder } from '../order/order.interfaces';

@Injectable()
export class WeixinService {
	// 注入的UserModelToken要与users.providers.ts里面的key一致就可以
	constructor(
		private readonly weixinUtil: WeixinUtil,
		private readonly orderService: OrderService,
	) {}
	// 处理回调
	async notifyCallback(xml) {
		const notifyObj = this.weixinUtil.payNotify(xml);
		if (!notifyObj) {
			return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[支付失败]]></return_msg></xml>`;
		}
		const order: IOrder | null = await this.orderService.findByPaySn(
			notifyObj.out_trade_no,
		);
		if (!order) {
			return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[订单不存在]]></return_msg></xml>`;
		}
		if (order.checkResult === 2) {
			return `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`;
		}
		const update = await this.orderService.paySuccess(
			order,
			notifyObj.transaction_id,
			1,
		);
		if (!update) {
			return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[订单不存在]]></return_msg></xml>`;
		}
		return `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`;
	}
}
