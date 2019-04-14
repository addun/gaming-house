import {Socket} from 'ngx-socket-io';

export class Snake extends Socket {
  private namespace: any;

  public constructor() {
    super({url: 'localhost:3000'});
  }

  public moveToUp() {
    this.emit('snake_direction', {
      direction: 'UP'
    });
  }

  public moveToDown() {
    this.emit('snake_direction', {
      direction: 'DOWN'
    });
  }

  public moveToRight() {
    this.emit('snake_direction', {
      direction: 'RIGHT'
    });
  }

  public moveToLeft() {
    this.emit('snake_direction', {
      direction: 'LEFT'
    });
  }
}
