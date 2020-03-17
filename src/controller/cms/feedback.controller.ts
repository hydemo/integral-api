import { Body, Controller, Get, Param, Post, Query, UseGuards, Inject, Request, Put, Response, Delete } from '@nestjs/common';
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
import { FeedbackService } from 'src/module/feedback/feedback.service';


@ApiUseTags('cms/feedback')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard(), RolesGuard)
@Controller('cms/feedbacks')
export class CMSFeedbackController {
  constructor(
    @Inject(FeedbackService) private feedbackService: FeedbackService,
  ) { }
  @Get('/')
  @Roles(2)
  @ApiOkResponse({
    description: '反馈列表',
  })
  @ApiOperation({ title: '反馈列表', description: '反馈列表' })
  async list(
    @Query() pagination: Pagination,
  ): Promise<any> {
    return await this.feedbackService.list(pagination)
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: '删除',
  })
  @Roles(1)
  @ApiOperation({ title: '删除', description: '删除' })
  async removeByFeedback(
    @Param('id', new MongodIdPipe()) id: string,
  ): Promise<any> {
    return await this.feedbackService.findByIdAndRemove(id)
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
    return await this.feedbackService.recoverById(id)
  }
}