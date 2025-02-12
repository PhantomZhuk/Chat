import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { Socket } from 'socket.io';
import { Server } from 'http';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messageService: MessageService) { }

  @WebSocketServer() server: Server;

  private activeUsers = new Set<string>();

  handleConnection(client: Socket) {
    console.log(`Користувач підключився: ${client.id}`);
    this.activeUsers.add(client.id);
  }

  handleDisconnect(client: Socket) {
    console.log(`Користувач відключився: ${client.id}`);
    this.activeUsers.delete(client.id);
  }

  // @SubscribeMessage('message')
  // handleMyMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
  //   console.log(`Отримано повідомлення: ${data}`);
  //   this.server.emit('myMessage', data);
  //   client.broadcast.emit('otherMessage', data);
  // }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    client.join(data);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    client.leave(data);
  }

  @SubscribeMessage('sendMessageToRoom')
  sendMessageToRoom(@MessageBody() data: { room: string; message: string }, @ConnectedSocket() client: Socket) {
    client.to(data.room).emit('myMessageToRoom', data.message);
    client.broadcast.to(data.room).emit('otherMessageToRoom', data.message);
  }
}
