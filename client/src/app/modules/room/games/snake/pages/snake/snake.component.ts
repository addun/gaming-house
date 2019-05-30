import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SnakeService, stringToColor } from '../../services/snake.service';
import { GUI } from '../../components/gui';
import { GameService } from '../../../../services/game.service';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.sass'],
})
export class SnakeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('board') public board: ElementRef<HTMLCanvasElement>;

  constructor(private snakeService: SnakeService) {}

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

    this.snakeService.positions.subscribe(state => {
      board.clear();
      state.tiles.forEach((row, indexOfRow) =>
        row.forEach((elInRow, indexOfColumn) => {
          if (elInRow !== null) {
            board.fillTile(
              {
                x: indexOfRow,
                y: indexOfColumn,
              },
              stringToColor(elInRow.id),
            );
          }
        }),
      );
    });
  }

  public startGame(): void {
    this.snakeService.start();
  }
}
