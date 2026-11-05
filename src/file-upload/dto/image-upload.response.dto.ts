import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description:
    'Successful Cloudinary upload. The live response can include additional Cloudinary fields.',
})
export class ImageUploadResponseDto {
  @ApiProperty({ example: 'blog-images/cover' })
  public_id: string;

  @ApiProperty({ example: 1710000000 })
  version: number;

  @ApiProperty({ example: 'upload', description: 'Cloudinary delivery type.' })
  type: string;

  @ApiProperty({ example: 'image' })
  resource_type: string;

  @ApiProperty({ example: 'jpg' })
  format: string;

  @ApiProperty({ example: 1200 })
  width: number;

  @ApiProperty({ example: 800 })
  height: number;

  @ApiProperty({ example: 245678 })
  bytes: number;

  @ApiProperty({
    example:
      'http://res.cloudinary.com/demo/image/upload/v1/blog-images/cover.jpg',
  })
  url: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/demo/image/upload/v1/blog-images/cover.jpg',
  })
  secure_url: string;

  @ApiProperty({ example: 'blog-images' })
  folder: string;

  @ApiProperty({ example: 'cover' })
  original_filename: string;

  @ApiProperty({ example: '2026-01-15T12:00:00Z' })
  created_at: string;
}
