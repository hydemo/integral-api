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
import { CreateCommentDTO } from 'src/module/comment/comment.dto';
import { CommentService } from 'src/module/comment/comment.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Pagination } from 'src/common/dto/pagination.dto';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';

@ApiUseTags('comment')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/comments')
export class ApiCommentController {
	constructor(@Inject(CommentService) private commentService: CommentService) {}

	@Get('/:id')
	@ApiOkResponse({
		description: '获取评论下级评论',
	})
	@ApiOperation({ title: '获取评论下级评论', description: '获取评论下级评论' })
	async list(
		@Query() pagination: Pagination,
		@Param('id', new MongodIdPipe()) id: string,
	): Promise<any> {
		return await this.commentService.findByBoundToObjectId(pagination, id);
	}

	@Delete('/:id')
	@UseGuards(AuthGuard())
	@ApiOkResponse({
		description: '删除评论',
	})
	@ApiOperation({ title: '删除评论', description: '删除评论' })
	async remove(
		@Param('id', new MongodIdPipe()) id: string,
		@Request() req: any,
	): Promise<any> {
		return await this.commentService.delete(id, req.user._id);
	}

	@Post('/:id')
	@ApiOkResponse({
		description: '二级评论',
	})
	@UseGuards(AuthGuard())
	@ApiOperation({ title: '删除评论', description: '删除评论' })
	async create(
		@Param('id', new MongodIdPipe()) id: string,
		@Body() comment: CreateCommentDTO,
		@Request() req: any,
	): Promise<any> {
		return await this.commentService.createComment(
			comment,
			req.user._id,
			id,
			'comment',
		);
	}
}
