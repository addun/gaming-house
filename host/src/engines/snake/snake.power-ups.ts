import { Point } from '../point.model';
import { Snake } from './snake.model';

export interface SnakePowerUp {
  readonly point: Point;

  onPickUp(snake: Snake): void;
}

export class SnakeFood implements SnakePowerUp {
  constructor(public readonly point: Point) {
    this.point = point;
  }

  onPickUp(snake: Snake): void {
    snake.increaseSize();
  }
}
