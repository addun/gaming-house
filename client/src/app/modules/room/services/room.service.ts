import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { merge, Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { Rooms } from './room.models';

@Injectable()
export class RoomService extends Socket {

  constructor(private http: HttpClient) {
    super({ url: 'localhost:3000/' });
  }

  public getRooms(): Observable<Rooms> {
    return merge(
      this.httpGetRooms(),
      this.fromEvent<Rooms>('rooms'),
    );
  }

  public addRoom(room: any) {
    this.emit('rooms', room);
  }

  private httpGetRooms(): Observable<Rooms> {
    return this.http.get<Rooms>('/api/rooms');
  }
}
