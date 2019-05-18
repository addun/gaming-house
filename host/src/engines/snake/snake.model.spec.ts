import { Direction, Snake } from './snake.model';
import { SnakePoint } from './snake.point';

describe('Snake', () => {
  let snake: Snake;

  beforeEach(() => {
    snake = new Snake(
      new SnakePoint({
        x: 10,
        y: 10,
      }),
      Direction.Right,
    );
  });

  it('should increase size in the next move', () => {
    snake.nextDirection = Direction.Right;
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
    snake.nextDirection = Direction.Right;
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
    snake.nextDirection = Direction.Right;
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
    snake.nextDirection = Direction.Right;
    snake.bodyChanges.subscribe(positions => {
      expect(positions.get(0)).toEqual({
        x: 11,
        y: 10,
      });
      done();
    });
    snake.move();
  });
});
