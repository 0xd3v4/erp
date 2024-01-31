import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

@Pipe({
  name: 'datetime'
})
export class DatetimePipe implements PipeTransform {

  transform(value: string, format: string): unknown {
    moment.locale('ru')
    return moment(value).format(format)
  }

}
