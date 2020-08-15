import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

moment.locale("es");

@Pipe({
  name: 'dates'
})
export class DatesPipe implements PipeTransform {

  transform(value: Date): string {
    const momentDate = moment(value);
    return momentDate.format("hh:mm A | MMM D"); 
  }

}
