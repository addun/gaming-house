import { Direction, Snake } from './snake.model';
import { SnakePoint } from './snake.point';
import { Board } from './snake.board';
import { Point } from '../point.model';
import { SnakeBodyElement } from './snake.power-ups';

describe('Snake', () => {
  let snake: Snake;
  let board: Board;
  let initialPositionOfSnake: SnakePoint;

  beforeEach(() => {
    board = new Board(
      new Point({
        x: 20,
        y: 20,
      }),
    );
    initialPositionOfSnake = new SnakePoint({
      x: 10,
      y: 10,
    });
    snake = new Snake(board, initialPositionOfSnake, Direction.Right);
    snake.nextDirection = Direction.Right;
  });

  it('should increase size in the next move', () => {
    snake.increaseSize();
    snake.move();

    expect(snake.body.size).toBe(2);
    expect(snake.body.get(0)).toEqual({
      x: 11,
      y: 10,
    });
    expect(snake.body.get(1)).toEqual({
      x: 10,
      y: 10,
    });
  });

  it('should change position after start and after waiting 700 ms', done => {
    snake.start();
    setTimeout(() => {
      expect(snake.head).toEqual({
        x: 12,
        y: 10,
      });
      done();
    }, 700);
  });

  it(`should change position after start, don't move after stop and move again after start`, done => {
    snake.start();

    setTimeout(() => {
      snake.stop();
    }, 600);

    setTimeout(() => {
      snake.start();
    }, 900);

    setTimeout(() => {
      expect(snake.head).toEqual({
        x: 13,
        y: 10,
      });
      done();
    }, 1200);
  });

  it('should receive current position after move', done => {
    snake.bodyChanges.subscribe(positions => {
      expect(positions.get(0)).toEqual({
        x: 11,
        y: 10,
      });
      done();
    });
    snake.move();
  });

  it('should clear/add tile after snake move', () => {
    let powerUp = board.getPowerUp(initialPositionOfSnake);
    expect(powerUp).toBeInstanceOf(SnakeBodyElement);

    snake.move();

    powerUp = board.getPowerUp(initialPositionOfSnake);
    expect(powerUp).toBeNull();

    powerUp = board.getPowerUp(snake.head);
    expect(powerUp).toBeInstanceOf(SnakeBodyElement);
  });

  describe('move()', () => {
    let initialPositionOnTopLeft;
    let initialPositionOnBottomRight;

    beforeEach(() => {
      initialPositionOnTopLeft = board.getTopLeft();
      initialPositionOnBottomRight = board.getBottomRight();
    });

    it('should appear on the top and show on the bottom', () => {
      snake = new Snake(board, initialPositionOnTopLeft, Direction.Up);
      snake.nextDirection = Direction.Up;
      snake.move();
      expect(snake.head.x).toEqual(board.getBottomRight().y);
    });
  });
});
