import { SnakePoint } from './snake.point';
import { Snake } from './snake.model';
import { Logger } from '@nestjs/common';
import { SnakeFood } from './snake.food';
import { List } from 'immutable';
import { startWith } from 'rxjs/operators';

const defaultBoard = (): BoardConfig => {
  return new BoardConfig(new SnakePoint({ y: 100, x: 100 }));
};

export class BoardConfig {
  constructor(public size: SnakePoint) {}
}

export class SnakeBoard {
  public snakes = List.of<Snake>();
  public snakeFoods = List.of<SnakeFood>();
  private logger = new Logger(SnakeBoard.name);

  public constructor(public config: BoardConfig = defaultBoard()) {}

  public registerSnake(snake: Snake) {
    snake.bodyChanges
      .pipe(startWith(snake.body))
      .subscribe(positions => this.handleSnakeMoving(snake, positions));

    this.snakes = this.snakes.push(snake);
    this.logger.log(`Snake added to board`);
  }

  public addFood(): void {
    this.snakeFoods.push({ point: this.getRandomFreePoint() });
  }

  public removeSnake(snake: Snake) {
    const index = this.snakes.indexOf(snake);
    if (index === -1) {
      this.logger.error(`Cannot remove snake from board`);
    } else {
      this.snakes.splice(index, 1);
      this.logger.log(`Snake removed from board`);
    }
  }

  /**
   * Check if point exist in this board
   */
  public pointExist(position: SnakePoint): boolean {
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x < this.config.size.x &&
      position.y < this.config.size.y
    );
  }

  public getRandomFreePoint(): SnakePoint {
    let point = this.getRandomPoint();
    while (this.isPointCollide(point)) {
      point = this.getRandomPoint();
    }
    return point;
  }

  public isPointCollide(pointToCheck: SnakePoint): boolean {
    return (
      this.snakes.some(snake =>
        snake.body.some(point => point.isEqual(pointToCheck)),
      ) || this.snakeFoods.some(food => food.point.isEqual(pointToCheck))
    );
  }

  /**
   * Get random point existing in this board
   */
  public getRandomPoint(): SnakePoint {
    const minX = 0;
    const maxX = this.config.size.x;
    const x = Math.floor(Math.random() * (maxX - minX) + minX);

    const minY = 0;
    const maxY = this.config.size.y;
    const y = Math.floor(Math.random() * (maxY - minY) + minY);

    return new SnakePoint({ x, y });
  }

  removeFood(point: SnakePoint): void {
    const index = this.snakeFoods.findIndex(f => f.point.isEqual(point));
    this.snakeFoods = this.snakeFoods.splice(index, 1);
  }

  private handleSnakeMoving(snake: Snake, positions: List<SnakePoint>): void {
    const head = snake.head;
    if (this.isPointOnAnotherSnake(head)) {
      snake.stop();
    } else if (this.isPointOnFood(head)) {
      snake.increaseSize();
      this.removeFood(head);
    }
  }

  private isPointOnFood(point: SnakePoint): boolean {
    return this.snakeFoods.some(food => food.point.isEqual(point));
  }

  private isPointOnAnotherSnake(point: SnakePoint): boolean {
    return this.snakes.some(snake =>
      snake.body.some(bodyPoint => bodyPoint.isEqual(point)),
    );
  }
}
