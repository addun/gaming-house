import { Logger } from '@nestjs/common';
import { Action, GameEngine, Output } from '../engine';
import { Point } from '../point.model';
import { UserEvents } from '../engine.models';
import { getDirection, Snake } from './snake.model';
import { SnakeFood } from './snake.power-ups';
import { Board } from './snake.board';
import { interval } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Users {
  [id: string]: {
    id: string;
    snake: Snake;
  };
}

@GameEngine()
export class SnakeEngine implements UserEvents {
  private board = new Board(new Point({ x: 100, y: 100 }));
  private users: Users = {};
  private readonly logger = new Logger(SnakeEngine.name);

  @Output() public boardChanges = this.board.changes$;

  private get userCount(): number {
    return Object.keys(this.users).length;
  }

  public onUserJoin(id: string) {
    const snake = new Snake(this.board);
    this.users[id] = {
      id,
      snake,
    };
    this.logger.log(`Snake with id ${id} added to board`);
  }

  public onUserLeave(id: string) {
    delete this.users[id];
    this.logger.log(
      `User ${id} removed from game. Number of connected users: ${
        this.userCount
      }`,
    );
  }

  @Action()
  public start() {
    Object.values(this.users).forEach(u => u.snake.start());
    interval(3000)
      .pipe(delay(Math.random() * 1000))
      .subscribe(() => this.addPowerUp());
  }

  @Action()
  public move(userId: string, direction: string) {
    this.users[userId].snake.nextDirection = getDirection(direction);
  }

  private addPowerUp(): void {
    /**
     * For now others power ups don't exist
     */
    const powerUp = new SnakeFood();
    this.board.setPowerUpOnFreeTile(powerUp);
  }
}

const stringToColour = str => {
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
