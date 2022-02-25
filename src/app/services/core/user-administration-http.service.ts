import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '@env/environment';
import {ServerResponse} from '@models/core/server.response';
import {Handler} from '../../exceptions/handler';
import {PaginatorModel, UserModel} from '@models/core';

@Injectable({
  providedIn: 'root'
})

export class UserAdministrationHttpService {
  private API_URL: string = environment.API_URL;

  private usersList: ServerResponse = {};
  private users = new BehaviorSubject<ServerResponse>({});
  public users$ = this.users.asObservable();

  private userModel: UserModel = {};
  private user = new BehaviorSubject<UserModel>({});
  public user$ = this.user.asObservable();

  private loaded = new BehaviorSubject<boolean>(true);
  public loaded$ = this.loaded.asObservable();

  private paginator = new BehaviorSubject<PaginatorModel>({current_page: 1, per_page: 15, total: 0});
  public paginator$ = this.paginator.asObservable();

  constructor(private httpClient: HttpClient) {

  }

  getUsers(page: number = 1, search: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/users`;

    const params = new HttpParams()
      .set('sort', 'lastname') //optional
      .append('per_page', '10') //optional
      .append('page', page) // conditional
      .append('search', search); // conditional

    this.loaded.next(true);
    return this.httpClient.get<ServerResponse>(url, {params})
      .pipe(
        map(response => response),
        tap(response => {
          this.usersList = response as ServerResponse;
          this.users.next(this.usersList);
          this.loaded.next(false);
          this.paginator.next(response.meta!);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  getUser(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/users/${id}`;

    this.loaded.next(true);
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          this.userModel = response.data;
          this.user.next(this.userModel);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  storeUser(user: UserModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/users`;

    this.loaded.next(true);
    return this.httpClient.post<ServerResponse>(url, user)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          this.usersList.data.push(response.data);
          this.users.next(this.usersList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  updateUser(id: number, user: UserModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/users/${id}`;

    this.loaded.next(true);
    return this.httpClient.put<ServerResponse>(url, user)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          const index = this.usersList.data.findIndex((user: UserModel) => user.id === response.data.id);
          this.usersList.data[index] = response.data;
          this.users.next(this.usersList);
        }, error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  deleteUser(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/users/${id}`;

    this.loaded.next(true);
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          this.usersList.data = this.usersList.data.filter((user: UserModel) => user.id !== response.data.id);
          this.users.next(this.usersList);
        },error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  deleteUsers(ids: (number|undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/user/destroys`;

    this.loaded.next(true);
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          ids.forEach(userId => {
            this.usersList.data = this.usersList.data.filter((user: UserModel) => user.id !== userId);
          })
          this.users.next(this.usersList);
        },error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  suspendUser(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/users/${id}/suspend`;

    this.loaded.next(true);
    return this.httpClient.patch<ServerResponse>(url,null)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          const index = this.usersList.data.findIndex((user: UserModel) => user.id === response.data.id);
          this.usersList.data[index] = response.data;
          this.users.next(this.usersList);
        },error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  reactiveUser(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/users/${id}/reactive`;

    this.loaded.next(true);
    return this.httpClient.patch<ServerResponse>(url,null)
      .pipe(
        map(response => response),
        tap(response => {
          this.loaded.next(false);
          const index = this.usersList.data.findIndex((user: UserModel) => user.id === response.data.id);
          this.usersList.data[index] = response.data;
          this.users.next(this.usersList);
        },error => {
          this.loaded.next(false);
        }),
        catchError(Handler.render)
      );
  }

  selectUser(user: UserModel) {
    this.user.next(user);
  }
}
