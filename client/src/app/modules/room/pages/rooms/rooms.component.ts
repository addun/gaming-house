import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { RoomFormComponent } from '../../components/room-form/room-form.component';
import { ModalService } from '../../../../shared/modal.service';
import { Observable } from 'rxjs';
import { Rooms } from '../../services/room.models';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../../../../core/logger.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.sass'],
})
export class RoomsComponent implements OnInit {
  rooms$: Observable<Rooms>;

  public constructor(private roomService: RoomService, private modalService: ModalService, private logger: LoggerService) {
  }

  ngOnInit(): void {
    this.rooms$ = this.roomService.getRooms().pipe(tap((rooms) => this.logger.log(`Getting rooms:`, rooms)));
  }

  openModal() {
    this.modalService.show(RoomFormComponent);
  }

}
