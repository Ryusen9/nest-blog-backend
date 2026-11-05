import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description:
    'Access token for the Authorization header. The refresh token is not included; it is set as an httpOnly cookie.',
})
export class AuthTokenResponseDto {
  @ApiProperty({ example: 1, description: 'Id of the authenticated user.' })
  id: number;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjF9.signature',
    description:
      'JWT access token. Send it as Authorization: Bearer <access_token>.',
  })
  access_token: string;
}

@ApiSchema({
  description: 'Profile of the user identified by the access token.',
})
export class AuthMeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ada@example.com', format: 'email' })
  email: string;

  @ApiProperty({ example: 'Ada' })
  firstName: string;

  @ApiProperty({ example: 'Lovelace' })
  lastName: string;

  @ApiProperty({ example: 'Writer and mathematician.' })
  bio: string;

  @ApiProperty({ example: 'author' })
  role: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', format: 'uri' })
  avatarUrl: string;
}

@ApiSchema({ description: 'Logout acknowledgement.' })
export class LogoutResponseDto {
  @ApiProperty({ example: 'Logged out' })
  message: string;
}
