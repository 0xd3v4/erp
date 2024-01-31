import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  transform(value: number|string, digits: boolean, sign: boolean): string {
    const valueSign = sign ? ' ₽' : '';
    if (typeof value === 'number') {
      const parts = value.toString().split('.');
      if (parts.length > 1) {
        const rubles = +parts[0];
        const sign = value >= 0 ? '' : '-';
        const kop = digits ? `00${parts[1].length > 2 ? parts[1].slice(0, 2) : parts[1]}`.slice(-2) : parts[1]
        return `${sign}${rubles.toLocaleString('ru-RU')}.${kop}`
      } else {
        const kop = digits ? `.00` : '';
        return `${value.toLocaleString('ru-RU')}${kop}${valueSign}`
      }
    } else {
      return value && value.trim() ? value.split(',').join(' ') + valueSign : `0${valueSign}`
    }
  }

}
