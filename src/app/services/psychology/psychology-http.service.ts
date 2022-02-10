import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '@env/environment';
import {ServerResponse} from '@models/core/server.response';
import {Handler} from '../../exceptions/handler';
import {PaginatorModel, UserModel} from '@models/core';
import {PatientModel, TestModel} from '@models/psychology';

@Injectable({
  providedIn: 'root'
})

export class PsychologyHttpService {
  private API_URL: string = environment.API_URL;

  constructor(private httpClient: HttpClient) {

  }

  saveAge(age: string) {
    localStorage.setItem('age', age);
  }

  savePatient(patient: PatientModel) {
    localStorage.setItem('patient', JSON.stringify(patient));
  }

  saveAgent(agent: PatientModel) {
    localStorage.setItem('agent', JSON.stringify(agent));
  }

  get patient(): PatientModel {
    return JSON.parse(String(localStorage.getItem('patient')));
  }

  get agent(): PatientModel {
    return JSON.parse(String(localStorage.getItem('agent')));
  }

  get age(): string {
    return JSON.parse(String(localStorage.getItem('age')));
  }

  storeTest(test: TestModel) {
    console.log(test);
    const url = this.API_URL + '/tests';
    return this.httpClient.post<ServerResponse>(url, test)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }
}

