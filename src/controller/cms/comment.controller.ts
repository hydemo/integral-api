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
import { CreateCommentFeedbackDTO } from 'src/module/comment/comment.dto';
import { CommentService } from 'src/module/comment/comment.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/dto/pagination.dto';

@ApiUseTags('comment')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('cms/comments')
@UseGuards(AuthGuard(), RolesGuard)
export class CMSCommentController {
	constructor(@Inject(CommentService) private commentService: CommentService) {}

	@Get('/good')
	@Roles(1)
	@ApiOkResponse({
		description: '根据商品获取评论列表',
	})
	@ApiOperation({
		title: '根据商品获取评论列表',
		description: '根据商品获取评论列表',
	})
	async listByGood(@Query() pagination: Pagination): Promise<any> {
		return await this.commentService.listByGood(pagination);
	}

	@Get('/user')
	@Roles(1)
	@ApiOkResponse({
		description: '根据用户获取评论列表',
	})
	@ApiOperation({
		title: '根据用户获取评论列表',
		description: '根据用户获取评论列表',
	})
	async listByUser(@Query() pagination: Pagination): Promise<any> {
		return await this.commentService.listByUser(pagination);
	}

	@Roles(1)
	@Delete('/:id')
	@ApiOkResponse({
		description: '删除评论',
	})
	@ApiOperation({ title: '删除评论', description: '删除评论' })
	async remove(@Param('id', new MongodIdPipe()) id: string): Promise<any> {
		return await this.commentService.deleteByAdmin(id);
	}

	@Roles(1)
	@Put('/:id/feedback')
	@ApiOkResponse({
		description: '评论回复',
	})
	@ApiOperation({ title: '评论回复', description: '评论回复' })
	async feedback(
		@Param('id', new MongodIdPipe()) id: string,
		@Body() feedback: CreateCommentFeedbackDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.commentService.feedback(id, feedback, req.user._id);
	}
}
