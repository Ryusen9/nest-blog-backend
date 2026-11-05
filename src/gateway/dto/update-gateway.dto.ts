import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateGatewayDto } from './create-gateway.dto';

@ApiSchema({
  description: 'No fields. The gateway does not expose an HTTP update body.',
})
export class UpdateGatewayDto extends PartialType(CreateGatewayDto) {}
