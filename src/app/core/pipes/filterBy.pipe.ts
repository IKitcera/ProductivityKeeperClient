import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterBy' })
export class FilterByPipe implements PipeTransform {
  transform(items: any[], field: string, value: any, invert: boolean = false): any[] {
    if (!items) {
      return [];
    }
    if (!field || !value) {
      return items;
    }

    return items.filter(item => item[field] === value !== invert);
  }
}
