import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { TemplateUtil } from 'src/utils/template.util';

@Injectable()
export class CmsControllerTemplateService {
	constructor(private readonly templateUtil: TemplateUtil) {}
	// 生成service
	create(path: string, name: string, description: string) {
		const upCaseName = `${name[0].toUpperCase()}${name.slice(1)}`;
		const codes: string[] = [];
		codes.push(`import {`);
		codes.push(`  UseGuards,`);
		codes.push(`  Controller,`);
		codes.push(`  Request,`);
		codes.push(`  Get,`);
		codes.push(`  Post,`);
		codes.push(`  Put,`);
		codes.push(`  Delete,`);
		codes.push(`  Body,`);
		codes.push(`  Param,`);
		codes.push(`  Query,`);
		codes.push(`} from '@nestjs/common';`);
		codes.push(`import {`);
		codes.push(`  ApiUseTags,`);
		codes.push(`  ApiOkResponse,`);
		codes.push(`  ApiForbiddenResponse,`);
		codes.push(`  ApiOperation,`);
		codes.push(`  ApiBearerAuth,`);
		codes.push(`} from '@nestjs/swagger';`);
		codes.push(`import { AuthGuard } from '@nestjs/passport';`);
		codes.push(`import { RolesGuard } from 'src/common/guard/roles.guard';`);
		codes.push(`import { Roles } from 'src/common/decorator/roles.decorator';`);
		codes.push(`import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';`);
		codes.push(`import { Pagination } from 'src/common/dto/pagination.dto';`);
		codes.push(
			`import { Create${upCaseName}DTO } from 'src/module/${name}/${name}.dto';`,
		);
		codes.push(
			`import { ${upCaseName}Service } from 'src/module/${name}/${name}.service';`,
		);

		codes.push(`@ApiUseTags('cms/${name}')`);
		codes.push(`@ApiBearerAuth()`);
		codes.push(`@ApiForbiddenResponse({ description: 'Unauthorized' })`);
		codes.push(`@UseGuards(AuthGuard(), RolesGuard)`);
		codes.push(`@Controller('cms/${name}s')`);
		codes.push(`export class CMS${upCaseName}Controller {`);
		codes.push(`  constructor(`);
		codes.push(`    private ${name}Service: ${upCaseName}Service,`);
		codes.push(`  ) { }\n`);

		codes.push(`  @Get('/')`);
		codes.push(`  @Roles(1)`);
		codes.push(`  @ApiOkResponse({`);
		codes.push(`    description: '${description}列表',`);
		codes.push(`  })`);
		codes.push(
			`  @ApiOperation({ title: '${description}列表', description: '${description}列表' })`,
		);
		codes.push(`  async list(`);
		codes.push(`    @Query() pagination: Pagination,`);
		codes.push(`  ): Promise<any> {`);
		codes.push(`    return await this.${name}Service.list(pagination)`);
		codes.push(`  }\n`);

		codes.push(`  @Get('/:id')`);
		codes.push(`  @Roles(1)`);
		codes.push(`  @ApiOkResponse({`);
		codes.push(`    description: '${description}详情',`);
		codes.push(`  })`);
		codes.push(
			`  @ApiOperation({ title: '${description}详情', description: '${description}详情' })`,
		);
		codes.push(`  async detail(`);
		codes.push(`    @Param('id', new MongodIdPipe()) id: string,`);
		codes.push(`  ): Promise<any> {`);
		codes.push(`    return await this.${name}Service.detail(id)`);
		codes.push(`  }\n`);

		codes.push(`  @Post('/')`);
		codes.push(`  @Roles(1)`);
		codes.push(`  @ApiOkResponse({`);
		codes.push(`    description: '新增${description}',`);
		codes.push(`  })`);
		codes.push(
			`  @ApiOperation({ title: '新增${description}', description: '新增${description}' })`,
		);
		codes.push(`  async create(`);
		codes.push(`    @Body() ${name}: Create${upCaseName}DTO,`);
		codes.push(`    @Request() req: any`);
		codes.push(`  ): Promise<any> {`);
		codes.push(
			`    return await this.${name}Service.create(${name}, String(req.user._id))`,
		);
		codes.push(`  }\n`);

		codes.push(`  @Put('/:id')`);
		codes.push(`  @Roles(1)`);
		codes.push(`  @ApiOkResponse({`);
		codes.push(`    description: '修改${description}',`);
		codes.push(`  })`);
		codes.push(
			`  @ApiOperation({ title: '修改${description}', description: '修改${description}' })`,
		);
		codes.push(`  async update(`);
		codes.push(`    @Body() ${name}: Create${upCaseName}DTO,`);
		codes.push(`    @Param('id', new MongodIdPipe()) id: string,`);
		codes.push(`  ): Promise<any> {`);
		codes.push(`    return await this.${name}Service.update(id, ${name})`);
		codes.push(`  }\n`);

		codes.push(`  @Delete('/:id')`);
		codes.push(`  @Roles(1)`);
		codes.push(`  @ApiOkResponse({`);
		codes.push(`    description: '删除${description}',`);
		codes.push(`  })`);
		codes.push(
			`  @ApiOperation({ title: '删除${description}', description: '删除${description}' })`,
		);
		codes.push(`  async remove(`);
		codes.push(`    @Param('id', new MongodIdPipe()) id: string,`);
		codes.push(`    @Request() req: any`);
		codes.push(`  ): Promise<any> {`);
		codes.push(
			`    return await this.${name}Service.remove(id, String(req.user._id))`,
		);
		codes.push(`  }\n`);

		codes.push(`  @Put('/:id/recover')`);
		codes.push(`  @Roles(1)`);
		codes.push(`  @ApiOkResponse({`);
		codes.push(`    description: '恢复${description}',`);
		codes.push(`  })`);
		codes.push(
			`  @ApiOperation({ title: '恢复${description}', description: '恢复${description}' })`,
		);
		codes.push(`  async recover(`);
		codes.push(`    @Param('id', new MongodIdPipe()) id: string,`);
		codes.push(`  ): Promise<any> {`);
		codes.push(`    return await this.${name}Service.recover(id)`);
		codes.push(`  }\n`);
		codes.push(`}`);
		fs.writeFileSync(
			`${path}/${name}.controller.ts`,
			this.templateUtil.toString(codes, '\n'),
		);
	}
}
