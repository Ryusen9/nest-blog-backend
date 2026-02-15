import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class SortingDataDto {
  @IsString()
  @IsOptional()
  sortBy?: string;

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
