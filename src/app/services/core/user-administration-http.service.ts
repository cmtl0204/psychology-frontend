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

  private loading = new BehaviorSubject<boolean>(true);
  public loading$ = this.loading.asObservable();

  private paginator = new BehaviorSubject<PaginatorModel>({current_page: 1, per_page: 25, total: 0});
  public paginator$ = this.paginator.asObservable();

  constructor(private httpClient: HttpClient) {

  }

  getUsers(page: number = 1, search: string = ''): Observable<ServerResponse> {
    this.loading.next(true);
    const url = this.API_URL + '/users';
    let params = new HttpParams().set('sort', 'lastname')
      .append('per_page', '10')
      .append('page', page)
      .append('search', search);

    if (search) {
      // params = params.append('search', search);
    }
    return this.httpClient.get<ServerResponse>(url, {params})
      .pipe(
        map(response => response),
        tap(response => {
          this.usersList = response as ServerResponse;
          this.users.next(this.usersList);
          this.loading.next(false);
          this.paginator.next(response.meta!);
        }, error => {
          this.loading.next(false);
        }),
        catchError(Handler.render)
      );
  }

  getUser(id: number): Observable<ServerResponse> {
    const url = this.API_URL + '/users/' + id;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        tap(response => {
          this.userModel = response.data;
          this.user.next(this.userModel);
        }),
        catchError(Handler.render)
      );
  }

  storeUser(user: UserModel): Observable<ServerResponse> {
    const url = this.API_URL + '/users';
    return this.httpClient.post<ServerResponse>(url, user)
      .pipe(
        map(response => response),
        tap(response => {
          this.usersList.data.push(response.data);
          this.users.next(this.usersList);
        }),
        catchError(Handler.render)
      );
  }

  updateUser(id: number | undefined, user: UserModel): Observable<ServerResponse> {
    const url = this.API_URL + '/users/' + id;
    return this.httpClient.put<ServerResponse>(url, user)
      .pipe(
        map(response => response),
        tap(response => {
          const index = this.usersList.data.findIndex((user: UserModel) => user.id === response.data.id);
          this.usersList.data[index] = response.data;
          this.users.next(this.usersList);
        }),
        catchError(Handler.render)
      );
  }

  deleteUser(id: number | undefined): Observable<ServerResponse> {
    const url = this.API_URL + '/users/' + id;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        tap(response => {
          this.usersList.data = this.usersList.data.filter((user: UserModel) => user.id !== response.data.id);
          this.users.next(this.usersList);
        }),
        catchError(Handler.render)
      );
  }

  deleteUsers(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = this.API_URL + '/user/destroys';
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        tap(response => {
          ids.forEach(userId => {
            this.usersList.data = this.usersList.data.filter((user: UserModel) => user.id !== userId);
          })
          this.users.next(this.usersList);
        }),
        catchError(Handler.render)
      );
  }

  selectUser(user: UserModel) {
    this.user.next(user);
  }
}

