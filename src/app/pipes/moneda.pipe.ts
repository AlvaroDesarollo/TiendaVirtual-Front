import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneda'
})
export class MonedaPipe implements PipeTransform {

  transform(value: number, parms: any): string {
    if(!parms) {
      return value.toString();
    }

    new CurrencyPipe('USD', value.toString(), )
    return '';
  }

}
