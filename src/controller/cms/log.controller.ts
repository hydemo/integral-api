import {
	UseGuards,
	Controller,
	Request,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	Query,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { Pagination } from 'src/common/dto/pagination.dto';
import { CreateLogDTO } from 'src/module/logRecord/logRecord.dto';
import { LogService } from 'src/module/logRecord/logRecord.service';
@ApiUseTags('cms/log')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/logs')
export class CMSLogController {
	constructor(private logService: LogService) {}

	@Get('/')
	@Roles(0)
	@ApiOkResponse({
		description: '日志列表',
	})
	@ApiOperation({ title: '日志列表', description: '日志列表' })
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.logService.list(pagination);
	}
}
