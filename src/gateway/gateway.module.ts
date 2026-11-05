import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { MyWebSocketGateway } from './gateway';

@Module({
  controllers: [GatewayController],
  providers: [GatewayService, MyWebSocketGateway],
})
export class GatewayModule {}
