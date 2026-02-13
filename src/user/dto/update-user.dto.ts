import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

const updateUserOmittedFields = ['role', 'hashedRefreshToken'] as const;

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, updateUserOmittedFields),
) {}
