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
import { CreateVipCardDTO } from 'src/module/vipCard/vipCard.dto';
import { VipCardService } from 'src/module/vipCard/vipCard.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';

@ApiUseTags('cms/vipCard')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/vipCards')
export class CMSVipCardController {
	constructor(@Inject(VipCardService) private vipCardService: VipCardService) {}

	@Get('/')
	@Roles(0)
	@ApiOkResponse({
		description: '充值卡列表',
	})
	@ApiOperation({ title: '充值卡列表', description: '充值卡列表' })
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.vipCardService.list(pagination);
	}

	@Post('/')
	@Roles(0)
	@ApiOkResponse({
		description: '新增充值卡',
	})
	@ApiOperation({ title: '新增充值卡', description: '新增充值卡' })
	async add(
		@Body() vipCard: CreateVipCardDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.vipCardService.create(vipCard, String(req.user._id));
	}

	@Delete('/:id')
	@ApiOkResponse({
		description: '删除',
	})
	@Roles(0)
	@ApiOperation({ title: '删除', description: '删除' })
	async removeByVipCard(
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.vipCardService.findByIdAndRemove(id);
	}

	@Put('/:id')
	@ApiOkResponse({
		description: '修改',
	})
	@Roles(0)
	@ApiOperation({ title: '修改', description: '修改' })
	async recoverByVipCard(
		@Param('id', new MongodIdPipe()) id: string,
		@Body() vipCard: CreateVipCardDTO,
	): Promise<any> {
		return await this.vipCardService.findByIdAndUpdate(id, vipCard);
	}

	@Put('/:id/recover')
	@ApiOkResponse({
		description: '恢复',
	})
	@Roles(0)
	@ApiOperation({ title: '恢复', description: '恢复' })
	async recoverByAdmin(
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.vipCardService.recoverById(id);
	}
}
