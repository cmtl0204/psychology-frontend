import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '@env/environment';
import {ServerResponse} from '@models/core/server.response';
import {Handler} from '../../exceptions/handler';
import {PaginatorModel} from '@models/core';
import {AgentModel, AssignmentModel, PatientModel, InstitutionModel, TestModel} from '@models/psychology';

@Injectable({
  providedIn: 'root'
})

export class InstitutionHttpService {
  private API_URL: string = environment.API_URL;

  private institutionsList: ServerResponse = {};
  private institutions = new BehaviorSubject<ServerResponse>({});
  public institutions$ = this.institutions.asObservable();

  private institutionModel: InstitutionModel = {};

  private institution = new BehaviorSubject<InstitutionModel>({});
  public institution$ = this.institution.asObservable();

  private selectedInstitution = new BehaviorSubject<InstitutionModel>({});
  public selectedInstitution$ = this.selectedInstitution.asObservable();

  private selectedInstitutions = new BehaviorSubject<InstitutionModel[]>([]);
  public selectedInstitutions$ = this.selectedInstitutions.asObservable();

  private loaded = new BehaviorSubject<boolean>(true);
  public loaded$ = this.loaded.asObservable();

  private paginator = new BehaviorSubject<PaginatorModel>({current_page: 1, per_page: 15, total: 0});
  public paginator$ = this.paginator.asObservable();

  constructor(private httpClient: HttpClient) {

  }

  getInstitutions(page: number = 1, search: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/institutions`;

    const params = new HttpParams()
      .append('page', page) // conditional
      .append('search', search); // conditional

    this.loaded.next(true);
    return this.httpClient.get<ServerResponse>(url, {params})
      .pipe(
        map(response => response),
        tap(response => {
          this.institutionsList = response as ServerResponse;
          this.institutions.next(this.institutionsList);
          this.loaded.next(false);
          this.paginator.next(response.meta!);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  getInstitution(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/institutions/${id}`;

    this.loaded.next(true);
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          this.institutionModel = response.data;
          this.institution.next(this.institutionModel);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  storeInstitution(institution: InstitutionModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/institutions`;

    this.loaded.next(true);
    return this.httpClient.post<ServerResponse>(url, institution)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          this.institutionsList.data.push(response.data);
          this.institutions.next(this.institutionsList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  updateInstitution(id: number, institution: InstitutionModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/institutions/${id}`;

    this.loaded.next(true);
    return this.httpClient.put<ServerResponse>(url, institution)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          const index = this.institutionsList.data.findIndex((institution: InstitutionModel) => institution.id === response.data.id);
          this.institutionsList.data[index] = response.data;
          this.institutions.next(this.institutionsList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  deleteInstitution(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/institutions/${id}`;

    this.loaded.next(true);
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          this.institutionsList.data = this.institutionsList.data.filter((institution: InstitutionModel) => institution.id !== response.data.id);
          this.institutions.next(this.institutionsList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  deleteInstitutions(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/institution/destroys`;

    this.loaded.next(true);
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          ids.forEach(institutionId => {
            this.institutionsList.data = this.institutionsList.data.filter((institution: InstitutionModel) => institution.id !== institutionId);
          })
          this.institutions.next(this.institutionsList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  selectInstitution(institution: InstitutionModel) {
    this.selectedInstitution.next(institution);
  }

  selectInstitutions(institutions: InstitutionModel[]) {
    this.selectedInstitutions.next(institutions);
  }

  all() {
    const url = `${this.API_URL}/institutions/all`;

    const params = new HttpParams()

    return this.httpClient.get<ServerResponse>(url, {params})
      .pipe(
        map(response => response),
        tap(response => {
          this.institutionsList = response as ServerResponse;
          this.institutions.next(this.institutionsList);
          this.loaded.next(false);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  assignment(institution: InstitutionModel, tests: TestModel[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/institutions/${institution.id}/assignment-tests`;

    this.loaded.next(true);
    return this.httpClient.post<ServerResponse>(url, {tests})
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }
}
