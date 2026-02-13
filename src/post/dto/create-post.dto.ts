import { IsBoolean, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  slug: string;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsUrl()
  thumbnail: string;
  @IsBoolean()
  published: boolean;
}
