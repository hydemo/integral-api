import {
	Controller,
	Post,
	Request,
	UseGuards,
	UseInterceptors,
	FileInterceptor,
	UploadedFile,
	Get,
} from '@nestjs/common';

import {
	ApiUseTags,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiConsumes,
	ApiImplicitFile,
	ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QiniuUtil } from 'src/utils/qiniu.util';

@ApiUseTags('api/upload')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('')
export class UploadController {
	constructor(private readonly qiniuUtil: QiniuUtil) {}
	@Post('upload')
	@ApiConsumes('multipart/form-data')
	@ApiImplicitFile({ name: 'file', required: true, description: '修改头像' })
	@UseInterceptors(FileInterceptor('file'))
	async uploadImage(@Request() req, @UploadedFile() file) {
		return { statusCode: 200, msg: '上传成功 ', data: file.filename };
	}

	@Get('upload/token')
	@UseGuards(AuthGuard())
	@ApiOperation({ title: '获取七牛云token', description: '获取七牛云token' })
	async uploadToken() {
		return this.qiniuUtil.getUpToken();
	}
}
