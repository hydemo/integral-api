import { Body, Controller, Get, Param, Post, Query, UseGuards, Inject, Request, Put, Response, Delete } from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateSpecificationDTO } from 'src/module/specification/specification.dto';
import { SpecificationService } from 'src/module/specification/specification.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';


@ApiUseTags('cms/specification')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/specifications')
export class CMSSpecificationController {
  constructor(
    @Inject(SpecificationService) private specificationService: SpecificationService,
  ) { }


  @Get('/')
  @Roles(1)
  @ApiOkResponse({
    description: '规格列表',
  })
  @ApiOperation({ title: '规格列表', description: '规格列表' })
  async list(
    @Query() pagination: Pagination,
  ): Promise<any> {
    return await this.specificationService.list(pagination)

  }

  @Get('/all')
  @Roles(1)
  @ApiOkResponse({
    description: '分类列表',
  })
  @ApiOperation({ title: '分类列表', description: '分类列表' })
  async all(
  ): Promise<any> {
    return await this.specificationService.all()

  }

  @Post('/')
  @Roles(1)
  @ApiOkResponse({
    description: '新增规格',
  })
  @ApiOperation({ title: '新增规格', description: '新增规格' })
  async add(
    @Body() specification: CreateSpecificationDTO,
    @Request() req: any
  ): Promise<any> {
    return await this.specificationService.create(specification, String(req.user._id))
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: '删除',
  })
  @Roles(1)
  @ApiOperation({ title: '删除', description: '删除' })
  async removeBySpecification(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.specificationService.findByIdAndRemove(id)
  }

  @Put('/:id')
  @ApiOkResponse({
    description: '修改',
  })
  @Roles(1)
  @ApiOperation({ title: '修改', description: '修改' })
  async recoverBySpecification(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() specification: CreateSpecificationDTO,
  ): Promise<any> {
    return await this.specificationService.findByIdAndUpdate(id, specification)
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
    return await this.specificationService.recoverById(id)
  }
}