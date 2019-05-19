import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GameService } from '../../../services/game.service';
import { LoggerService } from '../../../../../core/logger.service';
import { Observable } from 'rxjs';
import { Point } from '../components/point';
import { tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

export enum Direction {
  Up = 'UP',
  Right = 'RIGHT',
  Down = 'DOWN',
  Left = 'LEFT',
}

export interface Board {
  size: Point;
  tiles: {}[][];
}

@Injectable()
export class SnakeService {
  private socket: Socket;
  private gameId: string;

  constructor(
    private gameService: GameService,
    private logger: LoggerService,
  ) {}

  public get positions(): Observable<Board> {
    return this.socket.fromEvent('boardChanges');
  }

  public connectToGame(gameId: string = this.gameService.gameId) {
    this.gameId = gameId;
    this.socket = new Socket({
      url: `/games/${this.gameId}`,
    });

    this.socket.on('connect', () =>
      this.logger.log(`Connected to game with id: ${this.gameId}`),
    );
    this.socket.on('disconnect', () =>
      this.logger.log(`Disconnected from game with id: ${this.gameId}`),
    );
  }

  public disconnectFromGame() {
    this.socket.disconnect();
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
    return fromPromise(this.socket.fromOneTimeEvent<string>('myId')).pipe(
      tap(() => this.socket.emit('myId')),
    );
  }

  private move(direction: Direction) {
    this.socket.emit('move', direction);
    this.logger.log(`Sent direction ${direction} to server`);
  }
}
