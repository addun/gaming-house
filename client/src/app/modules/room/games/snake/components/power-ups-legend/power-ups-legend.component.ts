import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-power-ups-legend',
  templateUrl: './power-ups-legend.component.html',
  styleUrls: ['./power-ups-legend.component.sass'],
})
export class PowerUpsLegendComponent {
  powerUps: { name: string; description: string }[] = [
    {
      name: 'SnakeFood',
      description: 'Increase size',
    },
    {
      name: 'SpeederFood',
      description: 'Increase speed',
    },
    {
      name: 'LazyFood',
      description: 'Decrease speed',
    },
    {
      name: 'SnakeBodyElement',
      description: 'Block',
    },
  ];

  @HostBinding('class.card') cardClass = true;
}
