import { ApiSchema, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

const updateUserOmittedFields = ['role', 'hashedRefreshToken'] as const;

@ApiSchema({
  description:
    'Any subset of the create-user fields except role and hashedRefreshToken. Omitted fields are left unchanged.',
})
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, updateUserOmittedFields),
) {}
