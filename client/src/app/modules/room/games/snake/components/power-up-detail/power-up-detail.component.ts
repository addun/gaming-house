import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-power-up-detail',
  templateUrl: './power-up-detail.component.html',
  styleUrls: ['./power-up-detail.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PowerUpDetailComponent {
  @Input() name = '';
  @Input() description = '';

  @HostBinding('class.media') mediaClass = true;
}
