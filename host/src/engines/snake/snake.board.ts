import { SnakePowerUp } from './snake.power-ups';
import { Point } from '../point.model';
import { BehaviorSubject } from 'rxjs';
import { Direction } from './snake.model';

export type PowerUpOnBoard = SnakePowerUp | null;

export interface BoardState {
  size: Point;
  tiles: SnakePowerUp[][];
}

export class Board {
  private readonly board: PowerUpOnBoard[][] = [];
  private changesKeeper$ = new BehaviorSubject<BoardState>({
    size: this.size,
    tiles: this.board,
  });

  public get state() {
    return this.changesKeeper$.getValue();
  }

  public get changes$() {
    return this.changesKeeper$.asObservable();
  }

  public constructor(public readonly size: Point) {
    this.board = [];
    for (let i = 0; i < size.x; i++) {
      this.board.push([]);
      // @ts-ignore
      this.board[i].push(new Array(size.y));
      for (let j = 0; j < size.y; j++) {
        this.board[i][j] = null;
      }
    }
  }

  public isOutside(point: Point): null | Direction {
    if (this.isOutsideLeft(point)) {
      return Direction.Left;
    } else if (this.isOutsideRight(point)) {
      return Direction.Right;
    } else if (this.isOutsideTop(point)) {
      return Direction.Up;
    } else if (this.isOutsideBottom(point)) {
      return Direction.Down;
    } else {
      return null;
    }
  }

  public getTopLeft(): Point {
    return new Point({
      x: 0,
      y: this.size.y - 1,
    });
  }
  public getBottomRight(): Point {
    return new Point({
      x: this.size.x - 1,
      y: 0,
    });
  }

  public isOutsideLeft(point: Point): boolean {
    return point.x < 0;
  }

  public isOutsideRight(point: Point): boolean {
    return point.x >= this.size.x;
  }

  public isOutsideTop(point: Point): boolean {
    return point.y < 0;
  }

  public isOutsideBottom(point: Point): boolean {
    return point.y >= this.size.y;
  }

  public setPowerUp(point: Point, powerUp: SnakePowerUp) {
    this.setPowerUpOnTile(point, powerUp);
  }

  public clearPowerUp(point: Point) {
    this.setPowerUpOnTile(point, null);
  }

  public setPowerUpOnFreeTile(powerUp: SnakePowerUp) {
    const point = this.getFreeTilePosition();
    this.setPowerUp(point, powerUp);
  }

  public getFreeTilePosition(): Point {
    let point;
    do {
      point = this.getRandomPoint();
    } while (this.getPowerUp(point) !== null);
    return point;
  }

  public getPowerUp(point: Point): PowerUpOnBoard {
    return this.board[point.x][point.y];
  }

  /**
   * Get random point existing in the board
   */
  private getRandomPoint(): Point {
    const minX = 0;
    const maxX = this.size.x;
    const x = Math.floor(Math.random() * (maxX - minX) + minX);

    const minY = 0;
    const maxY = this.size.y;
    const y = Math.floor(Math.random() * (maxY - minY) + minY);

    return new Point({ x, y });
  }

  private setPowerUpOnTile(point: Point, powerUp: PowerUpOnBoard) {
    this.board[point.x][point.y] = powerUp;
    this.changesKeeper$.next({
      size: this.size,
      tiles: this.board,
    });
  }
}
