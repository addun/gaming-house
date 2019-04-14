import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { RoomComponent } from './pages/room/room.component';
import { GameGuard } from './guards/game.guard';

const routes: Routes = [
  {
    path: '',
    component: RoomsComponent,
  },
  {
    path: ':id',
    component: RoomComponent,
    canActivate: [GameGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'snake',
      },
      {
        path: 'snake',
        loadChildren: './games/snake/snake.module#SnakeModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomRoutingModule {
}
