import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  skip: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  take: number;
}
