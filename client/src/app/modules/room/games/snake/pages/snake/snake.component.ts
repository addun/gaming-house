import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

  constructor(private snakeService: SnakeService, private gameService: GameService) {
  }

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

    combineLatest(
      this.snakeService.foods,
      this.snakeService.positions,
    )
      .subscribe(([foods, positions]) => {
        board.clear();
        positions.forEach(user => {

          user.positions.forEach(p => {
            board.fillTile(p, stringToColour(user.id));
          });

        });
        foods.forEach(f => board.fillTile(f));
      });

  }

  public startGame(): void {
    this.snakeService.start();
  }

}

const stringToColour = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};
