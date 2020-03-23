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
import { WithdrawService } from 'src/module/withdraw/withdraw.service';
@ApiUseTags('cms/withdraw')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/withdraws')
export class CMSWithdrawController {
	constructor(private withdrawService: WithdrawService) {}

	@Get('/')
	@Roles(1)
	@ApiOkResponse({
		description: '提现列表',
	})
	@ApiOperation({ title: '提现列表', description: '提现列表' })
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.withdrawService.list(pagination);
	}

	@Put('/:id/accept')
	@Roles(1)
	@ApiOkResponse({
		description: '提现完成',
	})
	@ApiOperation({ title: '提现完成', description: '提现完成' })
	async accept(
		@Request() req: any,
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.withdrawService.accept(id, req.user._id);
	}

	@Put('/:id/reject')
	@Roles(1)
	@ApiOkResponse({
		description: '拒绝提现',
	})
	@ApiOperation({ title: '拒绝提现', description: '拒绝提现' })
	async reject(
		@Request() req: any,
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.withdrawService.reject(id, req.user._id);
	}
}
