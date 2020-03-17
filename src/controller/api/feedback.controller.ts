import { Body, Controller, Post, UseGuards, Inject, Request } from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorator/roles.decorator';
import { FeedbackService } from 'src/module/feedback/feedback.service';
import { CreateFeedbackDTO } from 'src/module/feedback/feedback.dto';


@ApiUseTags('feedback')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard())
@Controller('api/feedbacks')
export class ApiFeedbackController {
  constructor(
    @Inject(FeedbackService) private feedbackService: FeedbackService,
  ) { }

  @Post('/')
  @ApiOkResponse({
    description: '新增反馈',
  })
  @ApiOperation({ title: '新增反馈', description: '新增反馈' })
  async add(
    @Body() feedback: CreateFeedbackDTO,
    @Request() req: any
  ): Promise<any> {
    return await this.feedbackService.createFeedback(feedback, String(req.user._id))
  }
}