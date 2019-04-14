import {Injectable} from '@angular/core';

@Injectable()
export class GameService {
  private _gameId: string;

  get gameId(): string {
    return this._gameId;
  }

  set gameId(value: string) {
    this._gameId = value;
  }

}
