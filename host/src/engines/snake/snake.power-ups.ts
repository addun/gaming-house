import { Snake } from './snake.model';

export interface SnakePowerUp {
  onPickUp(snake: Snake): void;
}

export interface PowerUpConfig {
  color?: string;
  exclude?: true;
}

export interface PowerUpMetaData {
  color: string;
  exclude: boolean;
  className: string;
}

export const powerUps: PowerUpMetaData[] = [];

export function PowerUp(config: PowerUpConfig): ClassDecorator {
  return target => {
    powerUps.push({
      ...{
        color: '#000',
        exclude: false,
        className: target.name,
      },
      ...config,
    });
  };
}

@PowerUp({
  color: '#F00',
})
export class SnakeFood implements SnakePowerUp {
  onPickUp(snake: Snake): void {
    snake.increaseSize();
  }
}

@PowerUp({
  color: '#0F0',
  exclude: true,
})
export class SnakeBodyElement implements SnakePowerUp {
  onPickUp(snake: Snake): void {
    snake.stop();
  }
}
