import { ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description:
    'No fields. The gateway does not accept an HTTP body; realtime messages use Socket.IO.',
})
export class CreateGatewayDto {}
