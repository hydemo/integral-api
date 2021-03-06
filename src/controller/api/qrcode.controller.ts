import { Controller, Get, Param, Inject } from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { WeixinQrcodeService } from 'src/module/weixinQrcode/weixinQrcode.service';

@ApiUseTags('qrcode')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('qrcodes')
export class ApiQrcodeController {
	constructor(
		@Inject(WeixinQrcodeService)
		private weixinQrcodeService: WeixinQrcodeService,
	) {}

	@Get('/:id')
	@ApiOkResponse({
		description: '二维码信息',
	})
	@ApiOperation({ title: '二维码信息', description: '二维码信息' })
	async qrcode(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		return await this.weixinQrcodeService.findById(id);
	}
}
