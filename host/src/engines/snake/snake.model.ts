import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { List } from 'immutable';
import { SnakePoint } from './snake.point';
import { SnakeBoard } from './snake.board';
import { takeUntil } from 'rxjs/operators';

export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Right = 'RIGHT',
  Left = 'LEFT',
}

const moveToDirection = (point: SnakePoint, direction: Direction): SnakePoint => {
  switch (direction) {
    case Direction.Right:
      return new SnakePoint({
        x: point.x + 1,
        y: point.y,
      });
    case Direction.Down:
      return new SnakePoint({
        x: point.x,
        y: point.y + 1,
      });
    case Direction.Left:
      return new SnakePoint({
        x: point.x - 1,
        y: point.y,
      });
    case Direction.Up:
      return new SnakePoint({
        x: point.x,
        y: point.y - 1,
      });
  }

};

export const getRandomDirection = () => {
  const d = [Direction.Down, Direction.Left, Direction.Right, Direction.Up];
  return d[Math.floor(Math.random() * 5)];
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
  }
};

const isOppositeDirection = (direction1: Direction, direction2: Direction): boolean => {
  return direction1 === Direction.Up && direction2 === Direction.Down ||
    direction1 === Direction.Down && direction2 === Direction.Up ||
    direction1 === Direction.Left && direction2 === Direction.Right ||
    direction1 === Direction.Right && direction2 === Direction.Left;
};

export class Snake {
  public nextDirection: Direction = getRandomDirection();
  private increase: boolean = false;
  private currentDirection: Direction = this.nextDirection;
  private body$ = new BehaviorSubject<List<SnakePoint>>(List.of());
  private end$ = new Subject();

  public constructor(public board: SnakeBoard, initialPosition: SnakePoint = null) {
    this.board.addSnake(this);
    if (initialPosition === null) {
      initialPosition = this.board.getRandomFreePoint();
    }
    this.body$.next(List.of(initialPosition));
  }

  public get body(): List<SnakePoint> {
    return this.body$.getValue();
  }

  /**
   * Get current body and listen for changes
   */
  public get bodyChanges(): Observable<List<SnakePoint>> {
    return this.body$.asObservable();
  }

  public get head(): SnakePoint {
    return this.body.get(0);
  }

  public get tail(): SnakePoint {
    return this.body[this.body.size - 1];
  }

  public removeFromBoard(): void {
    this.end$.next();
    this.board.removeSnake(this);
  }

  public start() {
    interval(50).pipe(
      takeUntil(this.end$),
    ).subscribe(() => this.move());
  }

  public move() {
    const nextPoint = this.getNextPoint();

    if (!this.canGoToPoint(nextPoint)) {
      this.end$.next();
      return;
    }

    let newBody = this.body;
    this.increase ? this.increase = false : newBody = newBody.pop();
    this.body$.next(newBody.unshift(nextPoint));

    const isInFood = this.board.snakeFoods.some(f => f.point.isEqual(this.head));
    if (isInFood) {
      this.board.removeFood(this.head);
      this.increaseSize();
    }

  }

  public increaseSize() {
    this.increase = true;
  }

  private getNextPoint(): SnakePoint {
    let nextPoint: SnakePoint = null;
    if (isOppositeDirection(this.currentDirection, this.nextDirection)) {
      nextPoint = moveToDirection(this.head, this.currentDirection);
      this.nextDirection = this.currentDirection;
    } else {
      nextPoint = moveToDirection(this.head, this.nextDirection);
      this.currentDirection = this.nextDirection;
    }
    return nextPoint;
  }

  private canGoToPoint(point: SnakePoint): boolean {
    return this.board.pointExist(point) && !this.board.snakes.some(snake => snake.body.some(position => position.isEqual(point)));
  }

}
