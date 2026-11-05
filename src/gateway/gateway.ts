import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GatewayService } from './gateway.service';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000/',
  },
})
export class MyWebSocketGateway implements OnModuleInit {
  constructor(private gatewayService: GatewayService) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: Record<string, unknown>) {
    this.gatewayService.handleNewMessage(body);
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: body,
    });
  }
}
