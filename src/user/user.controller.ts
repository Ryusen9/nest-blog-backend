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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserDetailResponseDto,
  UserResponseDto,
} from './dto/user.response.dto';
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
    'User id. The value is coerced with Number(). A non-numeric value matches no row.',
  schema: { type: 'integer', example: 1 },
};

@ApiTags('User')
@ApiExtraModels(UserDetailResponseDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create a user',
    description:
      'Stores a new user. The password is hashed before insert. The response includes the stored password hash.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    description: 'A required field is missing or has the wrong format.',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'List users',
    description:
      'Returns every user. Posts, likes, and comments are not loaded.',
  })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Count users' })
  @ApiOkResponse({
    description: 'Total number of users.',
    schema: { type: 'integer', example: 12 },
  })
  @Get('count')
  count() {
    return this.userService.userCount();
  }

  @ApiOperation({
    summary: 'Get a user',
    description:
      'Returns the user with posts, likes, and comments. The body is null when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiOkResponse({
    description: 'The user, or null when the id does not exist.',
    schema: nullableBody(UserDetailResponseDto),
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update a user',
    description:
      'Updates the given fields. Role and the refresh-token hash cannot be changed here. `affected` is 0 when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UpdateResultDto })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    description: 'A field has the wrong format.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete a user',
    description:
      'Deletes the user. `affected` is 0 when the id does not exist.',
  })
  @ApiParam(idParam)
  @ApiOkResponse({ type: DeleteResultDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
