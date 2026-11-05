import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description:
    'Error body produced by Nest. `message` is a string for HTTP exceptions and a list of strings when validation fails.',
})
export class ApiErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    description: 'A single error message, or a list of validation messages.',
    oneOf: [
      { type: 'string', example: 'Invalid password' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['email must be an email'],
      },
    ],
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
