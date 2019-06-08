import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GameService } from '../../../services/game.service';
import { LoggerService } from '../../../../../core/logger.service';
import { Observable } from 'rxjs';
import { Point } from '../components/point';
import { fromPromise } from 'rxjs/internal-compatibility';

export enum Direction {
  Up = 'UP',
  Right = 'RIGHT',
  Down = 'DOWN',
  Left = 'LEFT',
}

export interface Tile {
  id: string;
  userBlock: boolean;
  userId?: string;
}

export interface Board {
  size: Point;
  tiles: Tile[][];
}

export const stringToColor = str => {
  if (!str) {
    return '#ffffff';
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // tslint:disable-next-line:no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    // tslint:disable-next-line:no-bitwise
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

@Injectable()
export class SnakeService implements OnDestroy {
  private socket: Socket;

  constructor(private gameService: GameService, private logger: LoggerService) {
    this.connectToGame();
  }

  public get positions(): Observable<Board> {
    return this.socket.fromEvent('boardChanges');
  }

  ngOnDestroy(): void {
    this.disconnectFromGame();
  }

  public connectToGame() {
    this.socket = new Socket({ url: `/games/${this.gameService.gameId}` });

    this.socket.on('connect', () =>
      this.logger.log(`Connected to game with id: ${this.gameService.gameId}`),
    );
    this.socket.on('disconnect', () =>
      this.logger.log(
        `Disconnected from game with id: ${this.gameService.gameId}`,
      ),
    );
  }

  public disconnectFromGame() {
    this.socket.disconnect();
  }

  public users(): Observable<string[]> {
    return this.socket.fromEvent<string[]>('userChanges');
  }

  public moveUp() {
    this.move(Direction.Up);
  }

  public moveDown() {
    this.move(Direction.Down);
  }

  public moveLeft() {
    this.move(Direction.Left);
  }

  public moveRight() {
    this.move(Direction.Right);
  }

  public start(): void {
    this.socket.emit('start');
    this.logger.log(`Sent start to server`);
  }

  public getMyId(): Observable<string> {
    return Observable.create(observe => {
      fromPromise(this.socket.fromOneTimeEvent<string>('myId')).subscribe(
        id => {
          observe.next(id);
          observe.complete();
        },
      );
      this.socket.emit('myId');
    });
  }

  private move(direction: Direction) {
    this.socket.emit('move', direction);
    this.logger.log(`Sent direction ${direction} to server`);
  }
}
