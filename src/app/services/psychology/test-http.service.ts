import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '@env/environment';
import {ServerResponse} from '@models/core/server.response';
import {Handler} from '../../exceptions/handler';
import {PaginatorModel} from '@models/core';
import {AgentModel, AssignmentModel, PatientModel, TestModel} from '@models/psychology';
import {ChatModel} from '@models/psychology/chat.model';
import {format} from 'date-fns';

@Injectable({
  providedIn: 'root'
})

export class TestHttpService {
  private API_URL: string = environment.API_URL;

  private testsList: ServerResponse = {};
  private tests = new BehaviorSubject<ServerResponse>({});
  public tests$ = this.tests.asObservable();

  private testModel: TestModel = {};

  private test = new BehaviorSubject<TestModel>({});
  public test$ = this.test.asObservable();

  private selectedTest = new BehaviorSubject<TestModel>({});
  public selectedTest$ = this.selectedTest.asObservable();

  private selectedTests = new BehaviorSubject<TestModel[]>([]);
  public selectedTests$ = this.selectedTests.asObservable();

  private loaded = new BehaviorSubject<boolean>(true);
  public loaded$ = this.loaded.asObservable();

  private paginator = new BehaviorSubject<PaginatorModel>({current_page: 1, per_page: 15, total: 0});
  public paginator$ = this.paginator.asObservable();

  constructor(private httpClient: HttpClient) {

  }

  getTests(page: number = 1, search: string = '', priorityIds: number[], stateIds: number[], provinceIds: number[], startedAt: string, endedAt: string): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests`;

    const params = new HttpParams()
      .append('page', page) // conditional
      .append('search', search)
      .append('priorities', priorityIds.toString())
      .append('states', stateIds.toString())
      .append('provinces', provinceIds.toString())
      .append('startedAt', startedAt)
      .append('endedAt', endedAt); // conditional

    this.loaded.next(true);
    return this.httpClient.get<ServerResponse>(url, {params})
      .pipe(
        map(response => response),
        tap(response => {
          this.testsList = response as ServerResponse;
          this.tests.next(this.testsList);
          this.loaded.next(false);
          this.paginator.next(response.meta!);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  getTest(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests/${id}`;

    this.loaded.next(true);
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          this.testModel = response.data;
          this.test.next(this.testModel);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  storeChat(chat: ChatModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests/chat`;

    this.loaded.next(true);
    return this.httpClient.post<ServerResponse>(url, chat)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          this.removeAge();
          this.removeAgent();
          this.removePatient();
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  updateTest(id: number, test: TestModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests/${id}`;

    this.loaded.next(true);
    return this.httpClient.put<ServerResponse>(url, test)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          const index = this.testsList.data.findIndex((test: TestModel) => test.id === response.data.id);
          this.testsList.data[index] = response.data;
          this.tests.next(this.testsList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  deleteTest(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests/${id}`;

    this.loaded.next(true);
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          this.testsList.data = this.testsList.data.filter((test: TestModel) => test.id !== response.data.id);
          this.tests.next(this.testsList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  deleteTests(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests/destroys`;

    this.loaded.next(true);
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          ids.forEach(testId => {
            this.testsList.data = this.testsList.data.filter((test: TestModel) => test.id !== testId);
          })
          this.tests.next(this.testsList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  assignmentTest(assignment: AssignmentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests/assignments`;

    this.loaded.next(true);
    return this.httpClient.post<ServerResponse>(url, assignment)
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

  closeTest(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests/${id}/close`;

    this.loaded.next(true);
    return this.httpClient.patch<ServerResponse>(url, null)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          const index = this.testsList.data.findIndex((test: TestModel) => test.id === response.data.id);
          this.testsList.data[index] = response.data;
          this.tests.next(this.testsList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  downloadTestResults(test: TestModel) {
    const url = `${this.API_URL}/reports/tests/${test.id}/results`;
    this.loaded.next(true);
    return this.httpClient.get(url, {responseType: 'blob' as 'json'})
      .subscribe(response => {
        this.loaded.next(false);
        const binaryData = [] as BlobPart[];
        binaryData.push(response as BlobPart);
        const filePath = URL.createObjectURL(new Blob(binaryData, {type: 'pdf'}));
        const downloadLink = document.createElement('a');
        downloadLink.href = filePath;
        downloadLink.setAttribute('download', `${test.code}_${format(new Date(), 'yyyy-MM-dd hh:mm:ss')}.pdf`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }, error => {
        this.loaded.next(false);
      });
  }

  downloadTestsResultsExcel(dates: Date[]) {
    const url = `${this.API_URL}/reports/tests/results`;
    this.loaded.next(true);
    return this.httpClient.post(url, {dates}, {responseType: 'blob' as 'json'})
      .subscribe(response => {
        this.loaded.next(false);
        const binaryData = [] as BlobPart[];
        binaryData.push(response as BlobPart);
        const filePath = URL.createObjectURL(new Blob(binaryData, {type: 'xlsx'}));
        const downloadLink = document.createElement('a');
        downloadLink.href = filePath;
        downloadLink.setAttribute('download', `tests_${format(new Date(), 'yyyy-MM-dd hh:mm:ss')}.xlsx`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }, error => {
        this.loaded.next(false);
      });
  }

  requestTransactionalCode(agent: AgentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests/generate-transactional-code`;
    return this.httpClient.post<ServerResponse>(url, agent)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  verifyTransactionalCode(code: string): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests/verify-transactional-code`;
    return this.httpClient.post<ServerResponse>(url, {code})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  countPriorities(provinceIds: number[], startedAt: string, endedAt: string): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests/count-priorities`;
    const params = new HttpParams()
      .append('provinces', provinceIds.toString())
      .append('startedAt', startedAt)
      .append('endedAt', endedAt);
    // this.loaded.next(true);
    return this.httpClient.get<ServerResponse>(url, {params})
      .pipe(
        map(response => response),
        tap(() => {
          // this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  countAllPriorities(provinceIds: number[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests/count-all-priorities`;
    const params = new HttpParams()
      .append('provinces', provinceIds.toString());

    // this.loaded.next(true);
    return this.httpClient.get<ServerResponse>(url, {params})
      .pipe(
        map(response => response),
        tap(() => {
          // this.loaded.next(false);
        }, error => {
          // this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  countAllTests(provinceIds: number[], startedAt: string, endedAt: string): Observable<ServerResponse> {
    const url = `${this.API_URL}/tests/count-all-tests`;
    const params = new HttpParams()
      .append('provinces', provinceIds.toString())
      .append('startedAt', startedAt)
      .append('endedAt', endedAt);
    // this.loaded.next(true);
    return this.httpClient.get<ServerResponse>(url, {params})
      .pipe(
        map(response => response),
        tap(() => {
          // this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  selectTest(test: TestModel) {
    this.selectedTest.next(test);
  }

  selectTests(tests: TestModel[]) {
    this.selectedTests.next(tests);
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

  public removePatient() {
    localStorage.removeItem('patient');
  }

  public removeAgent() {
    localStorage.removeItem('agent');
  }

  public removeAge() {
    localStorage.removeItem('age');
  }


}
