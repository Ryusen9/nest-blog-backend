import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import {
  LikeDetailResponseDto,
  LikeResponseDto,
} from './dto/like.response.dto';
import { DeleteResultDto } from 'src/global-dto/typeorm-result.response.dto';
import { nullableBody } from 'src/global-dto/nullable-schema';

const idParam = {
  name: 'id',
  required: true,
  description:
    'Like id. The value is coerced with Number(). A non-numeric value matches no row.',
  schema: { type: 'integer', example: 1 },
};

@ApiTags('Like')
@ApiExtraModels(LikeDetailResponseDto)
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({
    summary: 'Create a like',
    description:
      'Stores a like. The body has no fields; send an empty JSON object or omit it. Unknown properties are stripped.',
  })
  @ApiBody({
    type: CreateLikeDto,
    required: false,
    description: 'Empty object. No properties are accepted.',
  })
  @ApiCreatedResponse({ type: LikeResponseDto })
  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.create(createLikeDto);
  }

  @ApiOperation({
    summary: 'List likes',
    description: 'Returns every like. Posts and users are not loaded.',
  })
  @ApiOkResponse({ type: LikeResponseDto, isArray: true })
  @Get()
  findAll() {
    return this.likeService.findAll();
  }

  @ApiOperation({ summary: 'Count likes' })
  @ApiOkResponse({
    description: 'Total number of likes.',
    schema: { type: 'integer', example: 12 },
  })
  @Get('count')
  count() {
    return this.likeService.likeCount();
  }

  @ApiOperation({
    summary: 'Get a like',
    description:
      'Returns the like with the related post id and user id. The body is null when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiOkResponse({
    description: 'The like, or null when the id does not exist.',
    schema: nullableBody(LikeDetailResponseDto),
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likeService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Delete a like',
    description:
      'Deletes the like. `affected` is 0 when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiOkResponse({ type: DeleteResultDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeService.remove(+id);
  }
}
