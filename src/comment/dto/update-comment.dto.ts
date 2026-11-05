import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';

@ApiSchema({
  description:
    'Any subset of the comment fields. Omitted fields are left unchanged.',
})
export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
