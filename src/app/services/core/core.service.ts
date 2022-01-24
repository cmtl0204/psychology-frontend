import {Injectable} from '@angular/core';
import * as themes from '@assets/themes/themes.json';
import {MenuItem} from 'primeng/api';
import {ProfessionalModel} from "@models/core";

@Injectable({
  providedIn: 'root'
})

export class CoreService {
  constructor() {
  }

  changeTheme(theme: string) {
    // const themePath = themes.find(element => element.name == theme)?.path;
    // const element = document.getElementById('theme-css');
    // if (element && themePath) {
    //   element.setAttribute('href', themePath);
    // }
  }

  get alpha(): RegExp {
    return /^[a-zA-Z ]/;
  }

  set professional(professional: ProfessionalModel | undefined) {
    localStorage.setItem('professional', JSON.stringify(professional));
  }

  get professional(): ProfessionalModel {
    return JSON.parse(String(localStorage.getItem('professional')));
  }
}
