import { Pipe, PipeTransform } from '@angular/core';
import { stringToColor } from '../services/snake.service';

@Pipe({
  name: 'color',
})
export class ColorPipe implements PipeTransform {
  transform(value: any): any {
    return stringToColor(value);
  }
}
