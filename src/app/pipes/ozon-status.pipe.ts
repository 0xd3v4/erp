import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ozonStatus'
})
export class OzonStatusPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'delivering':
        return 'Доставляется';
      case 'delivered':
        return 'Доставлено';
      case 'awaiting_deliver':
        return 'Ожидает отправки';
      case 'awaiting_packaging':
        return 'Ожидает сборки';
      case 'not_accepted':
        return 'Не принято';
      case 'done':
        return 'Готово';
      case 'cancelled':
        return 'Отменён'
      default:
        return value ? value : '-';
    }
  }

}
