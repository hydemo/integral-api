import { Body, Controller, Get, Param, Post, Query, UseGuards, Inject, Request, Put, Response, Delete } from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateGoodDTO, UpdateProductDTO, BulkDTO } from 'src/module/good/good.dto';
import { GoodService } from 'src/module/good/good.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { CommentService } from 'src/module/comment/comment.service';


@ApiUseTags('cms/good')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/goods')
export class CMSGoodController {
  constructor(
    @Inject(GoodService) private goodService: GoodService,
    @Inject(CommentService) private commentService: CommentService,
  ) { }


  @Get('/')
  @Roles(2)
  @ApiOkResponse({
    description: '商品列表',
  })
  @ApiOperation({ title: '商品列表', description: '商品列表' })
  async list(
    @Query() pagination: Pagination,
    @Request() req: any
  ): Promise<any> {
    return await this.goodService.list(pagination, req.user)

  }

  @Post('/')
  @Roles(2)
  @ApiOkResponse({
    description: '新增商品',
  })
  @ApiOperation({ title: '新增商品', description: '新增商品' })
  async add(
    @Body() good: CreateGoodDTO,
    @Request() req: any
  ): Promise<any> {
    return await this.goodService.create(good, req.user)
  }

  @Put('/bulk')
  @Roles(2)
  @ApiOkResponse({
    description: '批量操作',
  })
  @ApiOperation({ title: '批量操作', description: '批量操作' })
  async bulk(
    @Body() bulk: BulkDTO,
    @Request() req: any
  ): Promise<any> {
    return await this.goodService.bulk(bulk.type, bulk.ids)
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: '删除',
  })
  @Roles(2)
  @ApiOperation({ title: '删除', description: '删除' })
  async removeByGood(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.goodService.findByIdAndRemove(id)
  }

  @Get('/:id')
  @ApiOkResponse({
    description: '详情',
  })
  @Roles(1)
  @ApiOperation({ title: '详情', description: '详情' })
  async detail(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.goodService.detail(id)
  }

  @Put('/:id')
  @ApiOkResponse({
    description: '修改',
  })
  @Roles(1)
  @ApiOperation({ title: '修改', description: '修改' })
  async recoverByGood(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() good: CreateGoodDTO,
  ): Promise<any> {
    return await this.goodService.findByIdAndUpdate(id, good)
  }

  @Put('/:id/product')
  @ApiOkResponse({
    description: '修改',
  })
  @Roles(1)
  @ApiOperation({ title: '修改', description: '修改' })
  async updateProduct(
    @Param('id', new MongodIdPipe()) id: string,
    @Body() product: UpdateProductDTO,
  ): Promise<any> {
    return await this.goodService.updateProduct(id, product)
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
    return await this.goodService.recoverById(id)
  }


}