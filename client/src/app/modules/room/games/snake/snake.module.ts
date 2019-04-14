import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SnakeComponent} from './pages/snake/snake.component';
import {SnakeService} from './services/snake.service';
import {SnakeRoutingModule} from './snake-routing.module';

@NgModule({
  declarations: [SnakeComponent],
  imports: [
    CommonModule,
    SnakeRoutingModule
  ],
  providers: [
    SnakeService
  ]
})
export class SnakeModule {
}
