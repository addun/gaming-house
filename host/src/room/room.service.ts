import { Injectable } from '@nestjs/common';
import { Room, RoomToCreate } from './room.models';
import { List } from 'immutable';
import uuid = require('uuid');

@Injectable()
export class RoomService {
  rooms: List<Room> = List();

  public createRoom(room: RoomToCreate) {
    const newRoom = {
      id: uuid.v1(),
      name: room.name,
    };
    this.rooms = this.rooms.unshift(newRoom);
    return newRoom;
  }
}
