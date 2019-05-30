import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SnakeComponent} from './pages/snake/snake.component';
import {SnakeService} from './services/snake.service';
import {SnakeRoutingModule} from './snake-routing.module';
import { PowerUpDetailComponent } from './components/power-up-detail/power-up-detail.component';
import { ColorPipe } from './pipes/color.pipe';
import { PowerUpsLegendComponent } from './components/power-ups-legend/power-ups-legend.component';

@NgModule({
  declarations: [SnakeComponent, PowerUpDetailComponent, ColorPipe, PowerUpsLegendComponent],
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
