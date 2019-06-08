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
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.sass'],
})
export class SnakeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('board') public board: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer') public canvasContainer: ElementRef<HTMLElement>;

  public users$: Observable<string[]>;
  private myId$: Observable<string>;
  private started = false;

  public constructor(private snakeService: SnakeService) {}

  public ngOnInit() {
    this.snakeService.connectToGame();
    this.users$ = this.snakeService.users();
    this.snakeService.getMyId().subscribe(console.warn);
    this.myId$ = this.snakeService.getMyId().pipe(share());
  }

  public ngOnDestroy(): void {
    this.snakeService.disconnectFromGame();
  }

  @HostListener('window:resize', ['$event'])
  public windowResize() {
    this.resizeCanvas();
  }

  @HostListener('window:keyup', ['$event'])
  public keyEvent(event: KeyboardEvent) {
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

  public ngAfterViewInit(): void {
    this.resizeCanvas();

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

  startGame(): void {
    this.started = true;
    this.snakeService.start();
  }

  private resizeCanvas() {
    this.board.nativeElement.width = 0;
    this.board.nativeElement.height = 0;

    const width = this.canvasContainer.nativeElement.clientWidth;
    this.board.nativeElement.width = width;
    // noinspection JSSuspiciousNameCombination
    this.board.nativeElement.height = width;
  }
}
