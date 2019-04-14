import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoomRoutingModule} from './room-routing.module';
import {RoomsComponent} from './pages/rooms/rooms.component';
import {SharedModule} from '../../shared/shared.module';
import {RoomFormComponent} from './components/room-form/room-form.component';
import {RoomComponent} from './pages/room/room.component';
import {RoomService} from './services/room.service';
import {GameService} from './services/game.service';
import {GameGuard} from './guards/game.guard';

@NgModule({
  imports: [
    CommonModule,
    RoomRoutingModule,
    SharedModule
  ],
  providers: [RoomService, GameService, GameGuard],
  declarations: [RoomsComponent, RoomFormComponent, RoomComponent],
  entryComponents: [RoomFormComponent]
})
export class RoomModule {
}
