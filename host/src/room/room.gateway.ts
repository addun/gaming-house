import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Client, Server } from 'socket.io';
import { RoomService } from './room.service';
import { Room, RoomToCreate } from './room.models';
import { Logger } from '@nestjs/common';
import { SnakeEngine } from '../engines/snake/snake.engine';
import { engineManager } from '../engines/engine';

interface RoomGame {
  [key: string]: object;
}

@WebSocketGateway()
export class RoomGateway {
  @WebSocketServer() public readonly server: Server;
  private readonly logger = new Logger(RoomGateway.name);
  private readonly snakeGames: RoomGame = {};

  public constructor(private roomService: RoomService) {
  }

  @SubscribeMessage('rooms')
  handleMessage(client: Client, room: RoomToCreate): void {
    this.logger.log(`Creating new room with name: ${room.name}`);
    const createdRoom = this.roomService.createRoom(room);
    this.logger.log(`Room created with: id: ${createdRoom.id}, name: ${createdRoom.name}`);

    this.logger.log(`Creating game with id ${createdRoom.id}`);
    // ToDo: Add support for other games
    this.snakeGames[createdRoom.id] = new SnakeEngine();

    this.logger.log(`The number of games created is ${Object.keys(this.snakeGames).length}`);

    this.createSocketRoomNamespace(createdRoom);

    this.server.emit('rooms', this.roomService.rooms);
  }

  private createSocketRoomNamespace(room: Room) {
    this.logger.log(`Creating new namespace with id: ${room.id}`);
    const namespace = this.server.of(`/games/${room.id}`);
    this.logger.log(`Namespace created with id: ${room.id}`);
    const game = this.snakeGames[room.id];

    const engine = engineManager.getEngine(game.constructor.name);

    engine.signals.forEach(signal => {
      game[signal].subscribe(data => namespace.emit(signal, data));
    });

    namespace.on('connection', socket => {

      const user = socket.client.id;
      this.logger.log(`User ${user} connected to namespace: ${room.id} by address ${socket.id}`);

      // @ts-ignore
      game.addUser(user);

      engine.actions.forEach(action => {
        socket.on(action, data => {
          this.logger.log(`User ${user} send data ${data} to action ${action}`);
          game[action](user, data);
        });
      });

      socket.on('disconnect', () => {
        // @ts-ignore
        game.removeUser(user);
        this.logger.log(`User (${user}) disconnected from namespace: ${room.id} by address ${socket.id}`);
      });

    });
  }
}
