import { getSchemaPath } from '@nestjs/swagger';

export function nullableBody(model: new (...args: any[]) => object) {
  return {
    nullable: true as const,
    allOf: [{ $ref: getSchemaPath(model) }],
  };
}
