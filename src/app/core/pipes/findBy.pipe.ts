import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'findBy',
    standalone: false
})
export class FindByPipe implements PipeTransform {

  transform(items: any[], property: string, value: any): any {
    if (!items) {
      return [];
    }

    return items.find(item => item[property] === value);
  }

}
