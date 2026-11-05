import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

@ApiSchema({ description: 'Payload for creating a user.' })
export class CreateUserDto {
  @ApiProperty({ example: 'Ada' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Lovelace' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'ada@example.com', format: 'email' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Writer and mathematician.' })
  @IsString()
  @IsNotEmpty()
  bio: string;

  @ApiProperty({
    example: 'https://example.com/avatar.png',
    format: 'uri',
  })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  avatarUrl: string;

  @ApiPropertyOptional({
    example: 'author',
    description: 'Optional role label.',
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({
    format: 'password',
    example: 'password123',
    description: 'Plain-text password. It is hashed before it is stored.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description:
      'Optional refresh-token hash. It is stored as sent. A later login replaces it.',
  })
  @IsString()
  @IsOptional()
  hashedRefreshToken?: string;
}
