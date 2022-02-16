import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '@env/environment';
import {ServerResponse} from '@models/core/server.response';
import {Handler} from '../../exceptions/handler';
import {PaginatorModel} from '@models/core';
import {AssignmentModel, PatientModel, QuestionModel} from '@models/psychology';

@Injectable({
  providedIn: 'root'
})

export class QuestionHttpService {
  private API_URL: string = environment.API_URL;

  private questionsList: ServerResponse = {};
  private questions = new BehaviorSubject<ServerResponse>({});
  public questions$ = this.questions.asObservable();

  private questionModel: QuestionModel = {};

  private question = new BehaviorSubject<QuestionModel>({});
  public question$ = this.question.asObservable();

  private selectedQuestion = new BehaviorSubject<QuestionModel>({});
  public selectedQuestion$ = this.selectedQuestion.asObservable();

  private selectedQuestions = new BehaviorSubject<QuestionModel[]>([]);
  public selectedQuestions$ = this.selectedQuestions.asObservable();

  private loaded = new BehaviorSubject<boolean>(true);
  public loaded$ = this.loaded.asObservable();

  private paginator = new BehaviorSubject<PaginatorModel>({current_page: 1, per_page: 15, total: 0});
  public paginator$ = this.paginator.asObservable();

  constructor(private httpClient: HttpClient) {

  }

  index(page: number = 1, search: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/questions`;

    const params = new HttpParams()
      .append('page', page) // conditional
      .append('search', search); // conditional

    this.loaded.next(true);
    return this.httpClient.get<ServerResponse>(url, {params})
      .pipe(
        map(response => response),
        tap(response => {
          this.questionsList = response as ServerResponse;
          this.questions.next(this.questionsList);
          this.loaded.next(false);
          this.paginator.next(response.meta!);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  show(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/questions/${id}`;

    this.loaded.next(true);
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          this.questionModel = response.data;
          this.question.next(this.questionModel);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  store(question: QuestionModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/questions`;

    this.loaded.next(true);
    return this.httpClient.post<ServerResponse>(url, question)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          this.questionsList.data.push(response.data);
          this.questions.next(this.questionsList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  update(id: number, question: QuestionModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/questions/${id}`;

    this.loaded.next(true);
    return this.httpClient.put<ServerResponse>(url, question)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          const index = this.questionsList.data.findIndex((question: QuestionModel) => question.id === response.data.id);
          this.questionsList.data[index] = response.data;
          this.questions.next(this.questionsList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  destroy(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/questions/${id}`;

    this.loaded.next(true);
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          this.questionsList.data = this.questionsList.data.filter((question: QuestionModel) => question.id !== response.data.id);
          this.questions.next(this.questionsList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  destroys(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/questions/destroys`;

    this.loaded.next(true);
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          ids.forEach(testId => {
            this.questionsList.data = this.questionsList.data.filter((question: QuestionModel) => question.id !== testId);
          })
          this.questions.next(this.questionsList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  all(): Observable<ServerResponse> {
    const url = `${this.API_URL}/questions/all`;

    this.loaded.next(true);
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        tap(response => {
          this.questionsList = response as ServerResponse;
          this.questions.next(this.questionsList);
          this.loaded.next(false);
          this.paginator.next(response.meta!);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  selectQuestion(question: QuestionModel) {
    this.selectedQuestion.next(question);
  }

  selectQuestions(questions: QuestionModel[]) {
    this.selectedQuestions.next(questions);
  }

  saveAge(age: string) {
    localStorage.setItem('age', age);
  }
}
