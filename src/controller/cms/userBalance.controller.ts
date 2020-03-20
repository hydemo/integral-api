import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UseGuards,
	Inject,
	Request,
	Put,
	Response,
	Delete,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { UserBalanceService } from 'src/module/userBalance/userBalance.service';

@ApiUseTags('cms/userBalance')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/userBalance')
export class CMSUserBalanceController {
	constructor(
		@Inject(UserBalanceService) private userBalanceService: UserBalanceService,
	) {}
	@Get('/')
	@Roles(1)
	@ApiOkResponse({
		description: '用户余额列表',
	})
	@ApiOperation({ title: '用户余额列表', description: '用户余额列表' })
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.userBalanceService.list(pagination);
	}
}
