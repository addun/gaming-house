import { Snake } from './snake.model';
import { timer } from 'rxjs';

export interface SnakePowerUp {
  id?: string;
  onPickUp(snake: Snake): void;
}

export interface SnakePowerUpConstructor {
  target: { new (): SnakePowerUp };
  config: PowerUpConfig;
}

export interface PowerUpConfig {
  id?: string;
  exclude?: boolean;
  userBlock?: boolean;
}

export const POWER_UP_META_DATA_KEY = 'POWER_UP_META_DATA_KEY';
export const POWER_UPS: SnakePowerUpConstructor[] = [];

export function PowerUp(config: PowerUpConfig): ClassDecorator {
  return target => {
    const mergedConfig: PowerUpConfig = {
      id: target.name,
      exclude: false,
      userBlock: false,
      ...config,
    };
    Reflect.defineMetadata(POWER_UP_META_DATA_KEY, mergedConfig, target);
    // @ts-ignore
    POWER_UPS.push({
      target,
      config: mergedConfig,
    } as SnakePowerUpConstructor);
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

@PowerUp({
  exclude: true,
  userBlock: true,
})
export class SnakeBodyElement implements SnakePowerUp {
  id;
  onPickUp(snake: Snake): void {
    snake.kill();
  }
}
