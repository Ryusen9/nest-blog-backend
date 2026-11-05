import { Injectable } from '@nestjs/common';

@Injectable()
export class GatewayService {
  handleNewMessage(body: any) {
    console.log('Received message:', body);
    // Add your business logic here
  }
}
