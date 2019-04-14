import { Point } from '../point.model';

export interface PointConstructor {
  readonly x: number;
  readonly y: number;
}

export class SnakePoint implements Point {
  readonly x: number;
  readonly y: number;

  public constructor(point: PointConstructor) {
    this.x = point.x;
    this.y = point.y;
  }

  public isEqual(point: SnakePoint) {
    return this.x === point.x && this.y === point.y;

  }
}
