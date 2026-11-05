import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsUrl } from 'class-validator';

@ApiSchema({ description: 'Payload for creating a post.' })
export class CreatePostDto {
  @ApiProperty({ example: 'Hello world' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'hello-world' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Post body in plain text.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    format: 'uri',
  })
  @IsString()
  @IsUrl()
  thumbnail: string;

  @ApiProperty({
    example: true,
    description: 'Whether the post is publicly published.',
  })
  @IsBoolean()
  published: boolean;
}
