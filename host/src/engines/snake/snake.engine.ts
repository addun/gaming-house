import { Logger } from '@nestjs/common';
import { Action, GameEngine, Output } from '../engine';
import { Point } from '../point.model';
import { List } from 'immutable';
import { UserEvents } from '../engine.models';
import { getDirection, Snake } from './snake.model';
import { SnakeFood, SnakePowerUp } from './snake.power-ups';
import { SnakePoint } from './snake.point';
import { startWith } from 'rxjs/internal/operators/startWith';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';

interface Users {
  [id: string]: {
    id: string;
    snake: Snake;
    color: string; // #000000 format
  };
}

interface UsersDTO {
  [id: string]: {
    id: string;
    snake: {
      body: Point[];
      color: string; // #000000 format
    };
  };
}

@GameEngine()
export class SnakeEngine implements UserEvents {
  private users: Users = {};
  @Output() public usersChanges = new Subject<UsersDTO>();

  private powerUps = List.of<SnakePowerUp>();
  private readonly logger = new Logger(SnakeEngine.name);
  private boardSize: Point = new Point({ x: 100, y: 100 });

  private get userCount(): number {
    return Object.keys(this.users).length;
  }

  public onUserJoin(id: string) {
    const snake = new Snake(this.getRandomSafePoint());
    this.users[id] = {
      id,
      snake,
      color: stringToColour(id),
    };
    this.logger.log(`Snake with id ${id} added to board`);

    // ToDo: Is it the right place for it?
    // ToDo: What about unsubscribe?
    snake.bodyChanges
      .pipe(
        startWith(snake.body),
        tap(() => this.handleSnakeMoving(snake)),
      )
      .subscribe(() => this.emitUsers());
  }

  public onUserLeave(id: string) {
    delete this.users[id];
    this.logger.log(
      `User ${id} removed from game. Number of connected users: ${
        this.userCount
      }`,
    );
    this.emitUsers();
  }

  @Action()
  public start() {
    Object.values(this.users).forEach(u => u.snake.start());
  }

  @Action()
  public move(userId: string, direction: string) {
    this.users[userId].snake.nextDirection = getDirection(direction);
  }

  private addPowerUp(): void {
    /**
     * For now others power ups don't exist
     */
    const powerUp = new SnakeFood(this.getRandomFreePoint());
    this.powerUps.push(powerUp);
  }

  /**
   * Check if point exist in this board
   */
  private pointExist(position: Point): boolean {
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x < this.boardSize.x &&
      position.y < this.boardSize.y
    );
  }

  /**
   * Get point which is away from border
   */
  private getRandomSafePoint(): Point {
    // ToDo: Add right implementation
    return this.getRandomFreePoint();
  }

  private getRandomFreePoint(): Point {
    let point;
    do {
      point = this.getRandomPoint();
    } while (this.isPointCollide(point));
    return point;
  }

  private isPointCollide(pointToCheck: Point): boolean {
    const users = Object.values(this.users);

    return (
      users.some(user =>
        user.snake.body.some(point => point.isEqual(pointToCheck)),
      ) || this.powerUps.some(powerUp => powerUp.point.isEqual(pointToCheck))
    );
  }

  /**
   * Get random point existing in this board
   */
  private getRandomPoint(): Point {
    const minX = 0;
    const maxX = this.boardSize.x;
    const x = Math.floor(Math.random() * (maxX - minX) + minX);

    const minY = 0;
    const maxY = this.boardSize.y;
    const y = Math.floor(Math.random() * (maxY - minY) + minY);

    return new Point({ x, y });
  }

  private handleSnakeMoving(snake: Snake): void {
    if (this.isPointOnSnake(snake.head)) {
      snake.stop();
    } else if (this.isPointOnPowerUp(snake.head)) {
      const powerUp = this.powerUps.find(p => p.point.isEqual(snake.head));
      powerUp.onPickUp(snake);
      this.removePowerUpOnPoint(snake.head);
    }
  }

  private isPointOnPowerUp(point: Point): boolean {
    return this.powerUps.some(powerUp => powerUp.point.isEqual(point));
  }

  private removePowerUpOnPoint(point: Point): void {
    const index = this.powerUps.findIndex(f => f.point.isEqual(point));
    this.powerUps = this.powerUps.splice(index, 1);
  }

  /**
   * @todo  How to change head of self snake?
   */
  private isPointOnSnake(point: SnakePoint): boolean {
    // const users = Object.values(this.users);
    // return users.some(user =>
    //   user.snake.body.some(bodyPoint => bodyPoint.isEqual(point)),
    // );
    return false;
  }

  private emitUsers(): void {
    const DTO = {};

    const values = Object.values(this.users);
    values.forEach(el => {
      DTO[el.id] = {
        id: el.id,
        snake: {
          body: el.snake.body,
          color: el.color,
        },
      };
    });
    this.usersChanges.next(DTO);
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
