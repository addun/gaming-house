import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {GameService} from '../services/game.service';

@Injectable()
export class GameGuard implements CanActivate {

  public constructor(private gameService: GameService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.gameService.gameId = next.paramMap.get('id');
    return true;
  }
}
