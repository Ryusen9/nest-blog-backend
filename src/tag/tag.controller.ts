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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagResponseDto } from './dto/tag.response.dto';
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
    'Tag id. The value is coerced with Number(). A non-numeric value matches no row.',
  schema: { type: 'integer', example: 1 },
};

@ApiTags('Tag')
@ApiExtraModels(TagResponseDto)
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: 'Create a tag' })
  @ApiBody({ type: CreateTagDto })
  @ApiCreatedResponse({ type: TagResponseDto })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    description: 'name must be a string.',
  })
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @ApiOperation({
    summary: 'List tags',
    description: 'Returns every tag. Posts that use the tags are not loaded.',
  })
  @ApiOkResponse({ type: TagResponseDto, isArray: true })
  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @ApiOperation({
    summary: 'Get a tag',
    description:
      'Returns the tag. Posts that use it are not loaded. The body is null when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiOkResponse({
    description: 'The tag, or null when the id does not exist.',
    schema: nullableBody(TagResponseDto),
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update a tag',
    description:
      'Updates the given fields. `affected` is 0 when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiBody({ type: UpdateTagDto })
  @ApiOkResponse({ type: UpdateResultDto })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    description: 'name must be a string when it is sent.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @ApiOperation({
    summary: 'Delete a tag',
    description: 'Deletes the tag. `affected` is 0 when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiOkResponse({ type: DeleteResultDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
