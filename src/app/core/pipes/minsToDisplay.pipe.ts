import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'minsToDisplay'
})
export class MinsToDisplayPipe implements PipeTransform {
  transform(mins: number): string {
    if (!mins) {
      return '';
    }
    if (mins < 60) {
      return `${mins} min`;
    }
    const checkOn0 =(val: number, name: string)=>
      val ? val.toString() + ' ' + name : '';

    if (mins >= 60 && mins < 1440) {
      const h = mins / 60;
      const m = mins % 60;
      return `${h} h ${checkOn0(m, 'min')}`;
    }
    const d = mins / 1440;
    const h = mins % 1440;
    const m = mins % 60;
    return `${d}d ${checkOn0(h, 'hr')} ${checkOn0(m, 'min')}`;
  }

}
