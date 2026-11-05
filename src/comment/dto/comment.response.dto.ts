import { ApiProperty, ApiSchema } from '@nestjs/swagger';

const dateTime = {
  type: String,
  format: 'date-time',
  example: '2026-01-15T12:00:00.000Z',
};

@ApiSchema({
  description:
    'Comment row returned by create and list. Relations are not loaded.',
})
export class CommentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Great post.' })
  content: string;

  @ApiProperty(dateTime)
  createdAt: Date;

  @ApiProperty(dateTime)
  updatedAt: Date;
}

@ApiSchema({ description: 'Author fields loaded with a single comment.' })
export class CommentAuthorResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ada' })
  firstName: string;

  @ApiProperty({ example: 'ada@example.com', format: 'email' })
  email: string;
}

@ApiSchema({ description: 'Post fields loaded with a single comment.' })
export class CommentPostResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Hello world' })
  title: string;
}

@ApiSchema({
  description: 'Comment with a partial author and a partial post loaded.',
})
export class CommentDetailResponseDto extends CommentResponseDto {
  @ApiProperty({ type: () => CommentAuthorResponseDto, nullable: true })
  user: CommentAuthorResponseDto | null;

  @ApiProperty({ type: () => CommentPostResponseDto, nullable: true })
  post: CommentPostResponseDto | null;
}
