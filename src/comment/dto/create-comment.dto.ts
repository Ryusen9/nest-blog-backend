import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@ApiSchema({ description: 'Payload for creating a comment.' })
export class CreateCommentDto {
  @ApiProperty({ example: 'Great post.' })
  @IsString()
  content: string;
}
