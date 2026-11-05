import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

@ApiSchema({ description: 'Email and password used to log in.' })
export class SignInDto {
  @ApiProperty({
    example: 'ada@example.com',
    format: 'email',
    description: 'Leading and trailing spaces are trimmed.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    format: 'password',
    minLength: 6,
    example: 'password123',
    description:
      'Leading and trailing spaces are trimmed. Minimum length is 6.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(6)
  @IsString()
  password: string;
}
