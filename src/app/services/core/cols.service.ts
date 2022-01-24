import {Injectable} from '@angular/core';
import * as themes from '../../../assets/themes/themes.json';
import {MenuItem} from 'primeng/api';
import {ColModel} from "@models/core";

@Injectable({
  providedIn: 'root'
})

export class ColsService {
  constructor() {
  }

  get catalogue(): ColModel[] {
    return [
      {field: 'name', header: 'Nombre'},
      {field: 'description', header: 'Descripción'},
    ];
  }
}
