import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@ApiSchema({ description: 'Filters for the post list.' })
export class PostQueryDto {
  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description:
      'When set, only posts with this published flag are returned. Send true or false.',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (value === true || value === false) return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiPropertyOptional({
    example: 'nestjs',
    description:
      'When set, only posts that have a tag with this exact name are returned.',
  })
  @IsString()
  @IsOptional()
  selectedTag?: string;
}
