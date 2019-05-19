import { Board } from './snake.board';
import { Point } from '../point.model';
import { SnakeBodyElement } from './snake.power-ups';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board(
      new Point({
        x: 100,
        y: 100,
      }),
    );
  });

  it('last element should be null', () => {
    const powerUp = board.getPowerUp(
      new Point({
        x: 99,
        y: 99,
      }),
    );
    expect(powerUp).toBeNull();
  });

  it('should find free element', () => {
    board = new Board(
      new Point({
        x: 3,
        y: 1,
      }),
    );

    for (let i = 0; i < 2; i++) {
      board.setPowerUp(
        new Point({
          x: i,
          y: 0,
        }),
        new SnakeBodyElement(),
      );
    }

    const freeTile = board.getFreeTilePosition();

    expect(freeTile).toEqual(
      new Point({
        x: 2,
        y: 0,
      }),
    );
  });

  it('should point be outside', () => {
    let outside = board.isOutside(
      new Point({
        x: 100,
        y: 50,
      }),
    );
    expect(outside).toBeTruthy();

    outside = board.isOutside(
      new Point({
        x: -1,
        y: 50,
      }),
    );
    expect(outside).toBeTruthy();
  });
});
