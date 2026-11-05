import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

@ApiSchema({ description: 'Page window for the post list.' })
export class PaginationDto {
  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
    example: 0,
    description: 'Number of posts to skip. Defaults to 0 when omitted.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  skip: number;

  @ApiPropertyOptional({
    minimum: 1,
    default: 15,
    example: 15,
    description: 'Number of posts to return. Defaults to 15 when omitted.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  take: number;
}
