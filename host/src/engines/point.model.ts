interface IPoint {
  x: number;
  y: number;
}

export class Point {
  public readonly x: number;
  public readonly y: number;

  constructor({ x, y }: IPoint) {
    this.x = x;
    this.y = y;
  }

  public isEqual(point: Point) {
    return this.x === point.x && this.y === point.y;
  }
}
