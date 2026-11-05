import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

const dateTime = {
  type: String,
  format: 'date-time',
  example: '2026-01-15T12:00:00.000Z',
};

@ApiSchema({
  description: 'Post row returned by create. Relations are not loaded.',
})
export class PostResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'hello-world' })
  slug: string;

  @ApiProperty({ example: 'Hello world' })
  title: string;

  @ApiProperty({ example: 'Post body.' })
  content: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg', format: 'uri' })
  thumbnail: string;

  @ApiProperty({ example: true })
  published: boolean;

  @ApiProperty(dateTime)
  createdAt: Date;

  @ApiProperty(dateTime)
  updatedAt: Date;
}

@ApiSchema({ description: 'Author fields included on each post in the list.' })
export class PostListAuthorDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ada@example.com', format: 'email' })
  email: string;

  @ApiProperty({ example: 'Ada' })
  firstName: string;
}

@ApiSchema({ description: 'Tag attached to a post in the list.' })
export class PostListTagDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'nestjs' })
  name: string;
}

@ApiSchema({
  description:
    'Post in a list response, with tags, a partial author, and like and comment counts.',
})
export class PostListItemResponseDto extends PostResponseDto {
  @ApiProperty({ type: () => PostListAuthorDto })
  user: PostListAuthorDto;

  @ApiProperty({ type: () => [PostListTagDto] })
  tags: PostListTagDto[];

  @ApiProperty({
    example: 4,
    description: 'Number of likes. Like rows are not loaded.',
  })
  likesCount: number;

  @ApiProperty({
    example: 2,
    description: 'Number of comments. Comment rows are not loaded.',
  })
  commentsCount: number;
}

@ApiSchema({
  description:
    'Author loaded with a single post. Includes the stored password hash. Nested posts, likes, and comments are not loaded.',
})
export class PostDetailUserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ada' })
  firstName: string;

  @ApiProperty({ example: 'Lovelace' })
  lastName: string;

  @ApiProperty({ example: 'ada@example.com', format: 'email' })
  email: string;

  @ApiProperty({ example: 'Writer and mathematician.' })
  bio: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', format: 'uri' })
  avatarUrl: string;

  @ApiProperty({ example: 'author' })
  role: string;

  @ApiProperty({
    example: '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUV',
    description: 'Stored bcrypt hash of the password.',
  })
  password: string;

  @ApiPropertyOptional({ nullable: true, example: null })
  hashedRefreshToken?: string | null;

  @ApiProperty(dateTime)
  createdAt: Date;

  @ApiProperty(dateTime)
  updatedAt: Date;
}

@ApiSchema({ description: 'Tag loaded with a single post.' })
export class PostDetailTagResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'nestjs' })
  name: string;
}

@ApiSchema({
  description: 'Like loaded with a single post. Only the id is loaded.',
})
export class PostDetailLikeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;
}

@ApiSchema({
  description:
    'Comment loaded with a single post. Nested author and post are not loaded.',
})
export class PostDetailCommentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Great post.' })
  content: string;

  @ApiProperty(dateTime)
  createdAt: Date;

  @ApiProperty(dateTime)
  updatedAt: Date;
}

@ApiSchema({
  description: 'Post with its author, tags, likes, and comments loaded.',
})
export class PostDetailResponseDto extends PostResponseDto {
  @ApiProperty({ type: () => PostDetailUserResponseDto, nullable: true })
  user: PostDetailUserResponseDto | null;

  @ApiProperty({ type: () => [PostDetailTagResponseDto] })
  tags: PostDetailTagResponseDto[];

  @ApiProperty({ type: () => [PostDetailLikeResponseDto] })
  likes: PostDetailLikeResponseDto[];

  @ApiProperty({ type: () => [PostDetailCommentResponseDto] })
  comments: PostDetailCommentResponseDto[];
}
