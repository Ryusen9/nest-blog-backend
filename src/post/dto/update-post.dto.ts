import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

@ApiSchema({
  description:
    'Any subset of the create-post fields. Omitted fields are left unchanged.',
})
export class UpdatePostDto extends PartialType(CreatePostDto) {}
