import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
import { PostService } from './post.service';
import { PaginationDto } from 'src/global-dto/pagination.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQueryDto } from './dto/query.dto';
import { SortingDataDto } from './dto/sortingdata.dto';
import {
  PostDetailResponseDto,
  PostListItemResponseDto,
  PostResponseDto,
} from './dto/post.response.dto';
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
    'Post id. The value is coerced with Number(). A non-numeric value matches no row.',
  schema: { type: 'integer', example: 1 },
};

@ApiTags('Post')
@ApiExtraModels(
  PostDetailResponseDto,
  PaginationDto,
  PostQueryDto,
  SortingDataDto,
)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Create a post' })
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({ type: PostResponseDto })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    description: 'A required field is missing or has the wrong format.',
  })
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @ApiOperation({
    summary: 'List posts',
    description:
      'Returns one page of posts. Each item includes its tags, the author id, email, and first name, plus like and comment counts. Query fields come from the pagination, filter, and sort DTOs.',
  })
  @ApiOkResponse({ type: PostListItemResponseDto, isArray: true })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    description:
      'skip, take, or sortOrder is present but invalid. skip must be an integer of at least 0, take an integer of at least 1, and sortOrder one of ASC, DESC, LATEST, or OLDEST.',
  })
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() queryDto: PostQueryDto,
    @Query() sortingDataDto: SortingDataDto,
  ) {
    return this.postService.findAll(paginationDto, queryDto, sortingDataDto);
  }

  @ApiOperation({ summary: 'Count posts' })
  @ApiOkResponse({
    description: 'Total number of posts.',
    schema: { type: 'integer', example: 12 },
  })
  @Get('count')
  count() {
    return this.postService.PostCount();
  }

  @ApiOperation({
    summary: 'Get a post by slug',
    description:
      'Returns the post with its author, tags, likes, and comments. The body is null when the slug does not exist.',
  })
  @ApiParam({
    name: 'slug',
    required: true,
    description: 'URL slug of the post.',
    schema: { type: 'string', example: 'hello-world' },
  })
  @ApiOkResponse({
    description: 'The post, or null when the slug does not exist.',
    schema: nullableBody(PostDetailResponseDto),
  })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postService.findOne(slug);
  }

  @ApiOperation({
    summary: 'Update a post',
    description:
      'Updates the given fields. `affected` is 0 when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiBody({ type: UpdatePostDto })
  @ApiOkResponse({ type: UpdateResultDto })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    description: 'A field has the wrong format.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @ApiOperation({
    summary: 'Delete a post',
    description:
      'Deletes the post. `affected` is 0 when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiOkResponse({ type: DeleteResultDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
