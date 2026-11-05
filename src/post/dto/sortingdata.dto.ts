import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

@ApiSchema({
  description:
    'Sort for the post list. An unsupported sortBy value falls back to createdAt.',
})
export class SortingDataDto {
  @ApiPropertyOptional({
    example: 'createdAt',
    description:
      'Column to sort by: id, slug, title, published, createdAt, or updatedAt. Any other value is ignored and createdAt is used.',
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    enum: ['ASC', 'DESC', 'LATEST', 'OLDEST'],
    example: 'DESC',
    description:
      'Direction. Matching is case-insensitive. LATEST is treated as DESC and OLDEST as ASC. Defaults to DESC when omitted.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string'
      ? value.toUpperCase() === 'LATEST'
        ? 'DESC'
        : value.toUpperCase() === 'OLDEST'
          ? 'ASC'
          : value.toUpperCase()
      : value,
  )
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
