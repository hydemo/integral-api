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
import { DataRecordService } from 'src/module/dataRecord/dataRecord.service';
@ApiUseTags('cms/dataRecord')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/dataRecords')
export class CMSDataRecordController {
	constructor(private dataRecordService: DataRecordService) {}
	@Get('/summary')
	@Roles(1)
	@ApiOkResponse({
		description: '获取汇总',
	})
	@ApiOperation({ title: '获取汇总数据', description: '获取汇总数据' })
	async summary(): Promise<any> {
		return await this.dataRecordService.getSummary();
	}

	@Get('/list')
	@Roles(1)
	@ApiOkResponse({
		description: '获取列表',
	})
	@ApiOperation({ title: '获取数据列表', description: '获取数据列表' })
	async list(
		@Query('start') start: string,
		@Query('end') end: string,
	): Promise<any> {
		return await this.dataRecordService.getRecordBetween(start, end);
	}

	@Get('/rank')
	@Roles(1)
	@ApiOkResponse({
		description: '获取销量排行',
	})
	@ApiOperation({ title: '获取销量排行', description: '获取销量排行' })
	async rank(): Promise<any> {
		return await this.dataRecordService.getRank();
	}

	@Get('/radar')
	@Roles(1)
	@ApiOkResponse({
		description: '获取销售额类别',
	})
	@ApiOperation({ title: '获取销售额类别', description: '获取销售额类别' })
	async radar(): Promise<any> {
		return await this.dataRecordService.getRadar();
	}
}
