import { UseGuards, Controller, Get, Query } from '@nestjs/common';
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
}
