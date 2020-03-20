import { Controller, Request, Post, Response } from '@nestjs/common';
import {
	ApiUseTags,
	ApiBearerAuth,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
} from '@nestjs/swagger';
import { WeixinService } from './weixin.service';

// UseGuards()傳入@nest/passport下的AuthGuard
// strategy
@ApiUseTags('/paynotify')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('')
export class WeixinController {
	constructor(private weixinService: WeixinService) {}

	@ApiOkResponse({
		description: '支付信息',
	})
	@Post('callback')
	@ApiOperation({ title: '微信支付回调', description: '微信支付回调' })
	async notifyCallback(@Request() req, @Response() res) {
		const data = await this.weixinService.notifyCallback(req.body.xml);
		res.setHeader('Content-Type', 'application/xml; charset=utf-8');
		res.end(data);
	}
}
