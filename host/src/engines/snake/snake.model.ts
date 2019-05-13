import { interval, Observable, Subject } from 'rxjs';
import { List } from 'immutable';
import { SnakePoint } from './snake.point';
import { takeUntil } from 'rxjs/operators';

export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Right = 'RIGHT',
  Left = 'LEFT',
}

export const getRandomDirection = () => {
  const directions = [
    Direction.Down,
    Direction.Left,
    Direction.Right,
    Direction.Up,
  ];
  return directions[Math.floor(Math.random() * 5)];
};

export const getDirection = (value: string): Direction => {
  switch (value) {
    case 'UP':
      return Direction.Up;
    case 'DOWN':
      return Direction.Down;
    case 'RIGHT':
      return Direction.Right;
    case 'LEFT':
      return Direction.Left;
    default:
      return Direction.Right;
  }
};

const isOppositeDirection = (
  direction1: Direction,
  direction2: Direction,
): boolean => {
  return (
    (direction1 === Direction.Up && direction2 === Direction.Down) ||
    (direction1 === Direction.Down && direction2 === Direction.Up) ||
    (direction1 === Direction.Left && direction2 === Direction.Right) ||
    (direction1 === Direction.Right && direction2 === Direction.Left)
  );
};

export class Snake {
  public nextDirection = getRandomDirection();
  private increase = false;
  private currentDirection = this.nextDirection;
  private bodyChanges$ = new Subject<List<SnakePoint>>();
  private end$ = new Subject();
  private speed = 250;
  /**
   * @usageNotes
   *
   * Is just for keeping snake body. If you want to get or update body
   * use snakeBody getter or setter
   */
  private snakeBodyKeeper: List<SnakePoint>;

  public constructor(initialPosition: SnakePoint) {
    this.snakeBodyKeeper = List.of(initialPosition);
  }

  public get body() {
    return this.snakeBody;
  }

  /**
   * @usageNotes
   *
   * If you want to get also current position you can use RxJS:
   *
   * @code
   *
   * snake.bodyChanges
   *  .pipe(
   *    startWith(snake.body)
   *  ).subscribe()
   */
  public get bodyChanges(): Observable<List<SnakePoint>> {
    return this.bodyChanges$.asObservable();
  }

  public get head(): SnakePoint {
    return this.snakeBody.get(0);
  }

  private get snakeBody(): List<SnakePoint> {
    return this.snakeBodyKeeper;
  }

  private set snakeBody(value: List<SnakePoint>) {
    this.snakeBodyKeeper = value;
    this.bodyChanges$.next(this.snakeBody);
  }

  /**
   * Start to move with defined speed
   */
  public start() {
    this.end$.next();
    interval(this.speed)
      .pipe(takeUntil(this.end$))
      .subscribe(() => this.move());
  }

  /**
   * Stop moving
   */
  public stop() {
    this.end$.next();
  }

  /**
   * Increase size of snake by one on next move
   */
  public increaseSize() {
    this.increase = true;
  }

  /**
   * Make one move based on current position of snake
   */
  public move() {
    const nextPoint = this.getNextPoint();

    if (this.increase) {
      this.increase = false;
      this.snakeBody = this.body.unshift(nextPoint);
    } else {
      this.snakeBody = this.body.unshift(nextPoint).pop();
    }
  }

  private getNextPoint(): SnakePoint {
    let nextPoint: SnakePoint = null;
    if (isOppositeDirection(this.currentDirection, this.nextDirection)) {
      nextPoint = this.moveToDirection(this.currentDirection);
      this.nextDirection = this.currentDirection;
    } else {
      nextPoint = this.moveToDirection(this.nextDirection);
      this.currentDirection = this.nextDirection;
    }
    return nextPoint;
  }

  private moveToDirection(direction: Direction): SnakePoint {
    switch (direction) {
      case Direction.Right:
        return new SnakePoint({ x: this.head.x + 1, y: this.head.y });
      case Direction.Down:
        return new SnakePoint({ x: this.head.x, y: this.head.y + 1 });
      case Direction.Left:
        return new SnakePoint({ x: this.head.x - 1, y: this.head.y });
      case Direction.Up:
        return new SnakePoint({ x: this.head.x, y: this.head.y - 1 });
      default:
        return new SnakePoint(this.head);
    }
  }
}
