import { Snake } from './snake.model';
import { timer } from 'rxjs';

export interface SnakePowerUp {
  onPickUp(snake: Snake): void;
}

export interface SnakePowerUpConstructor {
  new (): SnakePowerUp;
}

export interface PowerUpConfig {
  id?: string;
}

export const POWER_UP_META_DATA_KEY = 'POWER_UP_META_DATA_KEY';
export const POWER_UPS: SnakePowerUpConstructor[] = [];

export function PowerUp(config: PowerUpConfig): any {
  return target => {
    const mergedConfig = {
      id: target.name,
      ...config,
    };
    Reflect.defineMetadata(POWER_UP_META_DATA_KEY, mergedConfig, target);
    // @ts-ignore
    POWER_UPS.push(target);
  };
}

@PowerUp({})
export class SnakeFood implements SnakePowerUp {
  onPickUp(snake: Snake): void {
    snake.increaseSize();
  }
}

@PowerUp({})
export class SpeederFood implements SnakePowerUp {
  onPickUp(snake: Snake): void {
    snake.changeSpeed(speed => speed * 2);
    timer(5000).subscribe(() => snake.changeSpeed(speed => speed / 2));
  }
}

@PowerUp({})
export class LazyFood implements SnakePowerUp {
  onPickUp(snake: Snake): void {
    snake.changeSpeed(speed => speed / 2);
    timer(1000).subscribe(() => snake.changeSpeed(speed => speed * 2));
  }
}

@PowerUp({})
export class SnakeBodyElement implements SnakePowerUp {
  onPickUp(snake: Snake): void {
    snake.kill();
  }
}
