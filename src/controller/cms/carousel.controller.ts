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
	Delete,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateCarouselDTO } from 'src/module/carousel/carousel.dto';
import { CarouselService } from 'src/module/carousel/carousel.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';

@ApiUseTags('cms/carousel')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/carousels')
export class CMSCarouselController {
	constructor(
		@Inject(CarouselService) private carouselService: CarouselService,
	) {}

	@Get('/')
	@Roles(1)
	@ApiOkResponse({
		description: '轮播图列表',
	})
	@ApiOperation({ title: '轮播图列表', description: '轮播图列表' })
	async list(@Query() pagination: Pagination): Promise<any> {
		return await this.carouselService.list(pagination);
	}

	@Post('/')
	@Roles(1)
	@ApiOkResponse({
		description: '新增轮播图',
	})
	@ApiOperation({ title: '新增轮播图', description: '新增轮播图' })
	async add(
		@Body() carousel: CreateCarouselDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.carouselService.create(carousel, String(req.user._id));
	}

	@Delete('/:id')
	@ApiOkResponse({
		description: '删除',
	})
	@Roles(1)
	@ApiOperation({ title: '删除', description: '删除' })
	async removeByCarousel(
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.carouselService.findByIdAndRemove(id);
	}

	@Put('/:id')
	@ApiOkResponse({
		description: '修改',
	})
	@Roles(1)
	@ApiOperation({ title: '修改', description: '修改' })
	async recoverByCarousel(
		@Param('id', new MongodIdPipe()) id: string,
		@Body() carousel: CreateCarouselDTO,
	): Promise<any> {
		return await this.carouselService.findByIdAndUpdate(id, carousel);
	}

	@Put('/:id/recover')
	@ApiOkResponse({
		description: '恢复',
	})
	@Roles(1)
	@ApiOperation({ title: '恢复', description: '恢复' })
	async recoverByAdmin(
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.carouselService.recoverById(id);
	}
}
