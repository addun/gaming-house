import { Logger } from '@nestjs/common';
import { Action, GameEngine, Signal } from '../engine';
import { getDirection, Snake } from './snake.model';
import { SnakeBoard } from './snake.board';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { Point } from '../point.model';
import { List } from 'immutable';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { map } from 'rxjs/operators';

interface User {
  id: string;
  snake: Snake;
}

type Users = User[];

@GameEngine()
export class SnakeEngine {
  @Signal() public positions = new BehaviorSubject<any[]>([]);
  @Signal() public foods = new BehaviorSubject<List<Point>>(List());

  public readonly users: Users = [];
  private readonly board: SnakeBoard = new SnakeBoard();
  private readonly logger = new Logger(SnakeEngine.name);
  private started = false;
  private subscription: Subscription | null = null;

  public get usersLength(): number {
    return this.users.length;
  }

  @Action()
  public move(user: string, data: string) {
    this.users.find(u => u.id === user).snake.nextDirection = getDirection(data);
    this.logger.log(`User ${user} set direction to ${getDirection(data)}`);
  }

  @Action()
  public start() {
    if (!this.started) {
      this.users.forEach(u => u.snake.start());

      interval(150).subscribe(() => {
        this.board.addFood();
        this.foods.next(List(this.board.snakeFoods.map(f => f.point)));
      });

      this.started = true;
    }
  }

  public addUser(id: string): void {
    this.users.push({
      id,
      snake: new Snake(this.board),
    });
    this.refreshListeners();

    this.logger.log(`User ${id} connected to game`);
    this.logger.log(`${this.usersLength} users connected to game`);
  }

  public removeUser(id: string): void {
    const index = this.users.findIndex(u => u.id === id);
    this.users[index].snake.removeFromBoard();
    this.users.splice(index, 1);
    this.refreshListeners();
    this.logger.log(`User ${id} removed from game`);
    this.logger.log(`${this.usersLength} users connected to game`);
  }

  private refreshListeners(): void {
    const changes = this.users.map(u => u.snake.bodyChanges
      .pipe(
        map(value => {
            return {
              id: u.id,
              positions: value,
            };
          },
        ),
      ),
    );

    if (this.subscription !== null) {
      this.subscription.unsubscribe();
    }

    this.subscription = combineLatest(changes)
      .subscribe(points => this.positions.next(points));
  }

}
