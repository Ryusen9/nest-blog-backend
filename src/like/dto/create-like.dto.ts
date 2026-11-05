import { ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description:
    'No fields. Creating a like accepts an empty JSON object. Unknown properties are stripped.',
})
export class CreateLikeDto {}
