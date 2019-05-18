import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SnakeService } from '../../services/snake.service';
import { GUI } from '../../components/gui';
import { GameService } from '../../../../services/game.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.sass'],
})
export class SnakeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('board') public board: ElementRef<HTMLCanvasElement>;

  constructor(
    private snakeService: SnakeService,
    private gameService: GameService,
  ) {}

  ngOnInit() {
    this.snakeService.connectToGame();
  }

  ngOnDestroy(): void {
    this.snakeService.disconnectFromGame();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
        this.snakeService.moveUp();
        break;
      case 'd':
        this.snakeService.moveRight();
        break;
      case 's':
        this.snakeService.moveDown();
        break;
      case 'a':
        this.snakeService.moveLeft();
        break;
    }
  }

  ngAfterViewInit(): void {
    const board = new GUI(this.board.nativeElement.getContext('2d'));

    combineLatest(this.snakeService.positions).subscribe(([users]) => {
      board.clear();
      Object.values(users).forEach(user => {
        user.snake.body.forEach(p => {
          board.fillTile(p, user.snake.color);
        });
      });
    });
  }

  public startGame(): void {
    this.snakeService.start();
  }
}
