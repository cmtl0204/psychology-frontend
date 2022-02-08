import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'termsConditions'
})
export class TermsCondititonsPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): string {
    return value ? 'Aceptado' : 'Rechazado';
  }

}
