import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  CommentDetailResponseDto,
  CommentResponseDto,
} from './dto/comment.response.dto';
import { ApiErrorResponseDto } from 'src/global-dto/api-error.response.dto';
import {
  DeleteResultDto,
  UpdateResultDto,
} from 'src/global-dto/typeorm-result.response.dto';
import { nullableBody } from 'src/global-dto/nullable-schema';

const idParam = {
  name: 'id',
  required: true,
  description:
    'Comment id. The value is coerced with Number(). A non-numeric value matches no row.',
  schema: { type: 'integer', example: 1 },
};

@ApiTags('Comment')
@ApiExtraModels(CommentDetailResponseDto)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({
    summary: 'Create a comment',
    description:
      'Stores a comment. The body only accepts content; author and post are not set by this request.',
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({ type: CommentResponseDto })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    description: 'content must be a string.',
  })
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @ApiOperation({
    summary: 'List comments',
    description: 'Returns every comment. Authors and posts are not loaded.',
  })
  @ApiOkResponse({ type: CommentResponseDto, isArray: true })
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @ApiOperation({ summary: 'Count comments' })
  @ApiOkResponse({
    description: 'Total number of comments.',
    schema: { type: 'integer', example: 12 },
  })
  @Get('count')
  count() {
    return this.commentService.commentCount();
  }

  @ApiOperation({
    summary: 'Get a comment',
    description:
      'Returns the comment with the author id, first name, and email, and the post id and title. The body is null when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiOkResponse({
    description: 'The comment, or null when the id does not exist.',
    schema: nullableBody(CommentDetailResponseDto),
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update a comment',
    description:
      'Updates the given fields. `affected` is 0 when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiBody({ type: UpdateCommentDto })
  @ApiOkResponse({ type: UpdateResultDto })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    description: 'content must be a string when it is sent.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @ApiOperation({
    summary: 'Delete a comment',
    description:
      'Deletes the comment. `affected` is 0 when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiOkResponse({ type: DeleteResultDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
