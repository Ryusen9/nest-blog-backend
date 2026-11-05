import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description:
    'Like row returned by create and list. Relations are not loaded.',
})
export class LikeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;
}

@ApiSchema({ description: 'Related row reduced to its id.' })
export class LikeRelationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;
}

@ApiSchema({ description: 'Like with the related post id and user id loaded.' })
export class LikeDetailResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ type: () => LikeRelationResponseDto, nullable: true })
  post: LikeRelationResponseDto | null;

  @ApiProperty({ type: () => LikeRelationResponseDto, nullable: true })
  user: LikeRelationResponseDto | null;
}
