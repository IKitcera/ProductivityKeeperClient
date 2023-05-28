import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findBy'
})
export class FindByPipe implements PipeTransform {

  transform(items: any[], property: string, value: any): any {
    console.log(items, property, value)
    if (!items) {
      return [];
    }

    return items.find(item => item[property] === value);
  }

}
