import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Tag row. Posts that use the tag are not loaded.',
})
export class TagResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'nestjs' })
  name: string;
}
