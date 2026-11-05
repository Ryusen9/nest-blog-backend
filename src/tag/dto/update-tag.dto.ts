import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto';

@ApiSchema({
  description:
    'Any subset of the tag fields. Omitted fields are left unchanged.',
})
export class UpdateTagDto extends PartialType(CreateTagDto) {}
