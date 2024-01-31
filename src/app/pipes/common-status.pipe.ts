import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commonStatus'
})
export class CommonStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
