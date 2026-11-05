import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

const dateTime = {
  type: String,
  format: 'date-time',
  example: '2026-01-15T12:00:00.000Z',
};

@ApiSchema({
  description:
    'Post columns loaded with a user. Nested relations are not loaded.',
})
export class UserPostResponseDto {
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

@ApiSchema({
  description: 'Like row loaded with a user. Only the id is loaded.',
})
export class UserLikeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;
}

@ApiSchema({
  description:
    'Comment columns loaded with a user. Nested relations are not loaded.',
})
export class UserCommentResponseDto {
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
  description:
    'User row. `password` is the stored bcrypt hash. Relations are omitted on create and list.',
})
export class UserResponseDto {
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

  @ApiPropertyOptional({
    nullable: true,
    example: null,
    description:
      'Bcrypt hash of the active refresh token, or null when no session is stored.',
  })
  hashedRefreshToken?: string | null;

  @ApiProperty(dateTime)
  createdAt: Date;

  @ApiProperty(dateTime)
  updatedAt: Date;
}

@ApiSchema({
  description: 'User row with posts, likes, and comments loaded.',
})
export class UserDetailResponseDto extends UserResponseDto {
  @ApiProperty({ type: () => [UserPostResponseDto] })
  posts: UserPostResponseDto[];

  @ApiProperty({ type: () => [UserLikeResponseDto] })
  likes: UserLikeResponseDto[];

  @ApiProperty({ type: () => [UserCommentResponseDto] })
  comments: UserCommentResponseDto[];
}
