import {
	UseGuards,
	Controller,
	Get,
	Query,
	Response,
	Request,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiBearerAuth,
} from '@nestjs/swagger';
import * as fs from 'fs';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/dto/pagination.dto';
import { ServiceFeeService } from 'src/module/serviceFee/serviceFee.service';
@ApiUseTags('cms/serviceFee')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/serviceFees')
export class CMSServiceFeeController {
	constructor(private serviceFeeService: ServiceFeeService) {}

	@Get('/')
	@Roles(1)
	@ApiOkResponse({
		description: '平台服务费统计列表',
	})
	@ApiOperation({
		title: '平台服务费统计列表',
		description: '平台服务费统计列表',
	})
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.serviceFeeService.list(pagination);
	}

	@Get('/download')
	@Roles(1)
	@ApiOkResponse({
		description: '订单列表',
	})
	@ApiOperation({ title: '订单列表', description: '订单列表, checkResult' })
	async download(
		@Request() req: any,
		@Response() res: any,
		@Query('start') start: string,
		@Query('end') end: string,
	): Promise<any> {
		const userAgent = (req.headers['user-agent'] || '').toLowerCase();
		const filename = await this.serviceFeeService.download(start, end);
		const path = `temp/excel/${filename}`;
		let disposition;
		if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
			disposition = `attachment; filename=${encodeURIComponent(filename)}`;
		} else if (userAgent.indexOf('firefox') >= 0) {
			disposition = `attachment; filename*="utf8''${encodeURIComponent(
				filename,
			)}"`;
		} else {
			/* safari等其他非主流浏览器只能自求多福了 */
			disposition = `attachment; filename=${new Buffer(filename).toString(
				'binary',
			)}`;
		}
		res.writeHead(200, {
			'Content-Type': 'application/octet-stream;charset=utf8',
			'Content-Disposition': disposition,
		});
		const stream = fs.createReadStream(path);
		stream.pipe(res);
		stream
			.on('end', () => {
				fs.exists(path, exists => {
					if (exists) fs.unlink(path, err => {});
				});
				return;
			})
			.on('error', err => {
				return;
			});
	}
}
