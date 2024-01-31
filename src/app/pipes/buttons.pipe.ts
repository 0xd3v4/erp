import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buttons'
})
export class ButtonsPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'confirm': return 'Да';
      case 'no': return 'Нет';
      case 'remove': return 'Удалить';
      case 'unlink': return 'Отвязать';
      case 'cancel':
      case 'cancel_confirm':
        return 'Отменить';
      default: return value;
    }
  }

}
