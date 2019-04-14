import { Controller, Get } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('/api/rooms')
export class RoomController {
  public constructor(private  roomService: RoomService) {

  }

  @Get('/')
  public getRooms() {
    return this.roomService.rooms;
  }
}
