import { Logger } from '@nestjs/common';
import { Action, GameEngine, Output } from '../engine';
import { Point } from '../point.model';
import { UserEvents } from '../engine.models';
import { getDirection, Snake } from './snake.model';
import { POWER_UPS, SnakeFood } from './snake.power-ups';
import { Board } from './snake.board';
import { forkJoin, interval } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Users {
  [id: string]: {
    id: string;
    snake: Snake;
  };
}

@GameEngine()
export class SnakeEngine implements UserEvents {
  private board = new Board(new Point({ x: 25, y: 25 }));
  private users: Users = {};
  private readonly logger = new Logger(SnakeEngine.name);
  private gameStarted = false;

  @Output() public boardChanges = this.board.changes$;

  private get userCount(): number {
    return Object.keys(this.users).length;
  }

  public onUserJoin(id: string) {
    if (this.gameStarted) {
      return;
    }

    const snake = new Snake(this.board);
    this.users[id] = {
      id,
      snake,
    };
    this.logger.log(`Snake with id ${id} added to board`);
  }

  public onUserLeave(id: string) {
    delete this.users[id];
    this.logger.log(
      `User ${id} removed from game. Number of connected users: ${
        this.userCount
      }`,
    );
  }

  @Action()
  public start() {
    if (this.gameStarted) {
      return;
    }
    this.gameStarted = true;
    Object.values(this.users).forEach(u => u.snake.start());
    const powerUpsSub = interval(3000)
      .pipe(delay(Math.random() * 1000))
      .subscribe(() => this.addPowerUp());

    const kills$ = Object.values(this.users).map(
      user => user.snake.killedChanges,
    );

    forkJoin(kills$).subscribe(values => {
      if (!values.some(isKilled => !isKilled)) {
        powerUpsSub.unsubscribe();
      }
    });
  }

  @Action()
  public move(userId: string, direction: string) {
    this.users[userId].snake.nextDirection = getDirection(direction);
  }

  private addPowerUp(): void {
    const PowerUpConstructor =
      POWER_UPS[Math.floor(Math.random() * POWER_UPS.length)];
    const powerUp = new PowerUpConstructor();
    this.board.setPowerUpOnFreeTile(powerUp);
  }
}
