import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@ApiSchema({ description: 'Payload for creating a tag.' })
export class CreateTagDto {
  @ApiProperty({ example: 'nestjs' })
  @IsString()
  name: string;
}
