import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '@services/core/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let flag = false;
    let headers = request.headers ? request.headers : new HttpHeaders();
    let params = request.params ? request.params : new HttpParams();
    if (!params.get('page')) {
      params = params.append('page', '1');
    }
    if (!params.get('per_page')) {
      params = params.append('per_page', '15');
    }

    request.headers.getAll('Content-Type')?.forEach(header => {
      if (header == 'multipart/form-data') {
        flag = true;
      }
    });

    if (flag) {
      headers = headers
        .append('Accept', 'application/json')
        .append('Authorization', 'Bearer ' + this.authService.token);
    } else {
      headers = headers
        .append('Accept', 'application/json')
        .append('Content-Type', 'application/json')
        .append('Authorization', 'Bearer ' + this.authService.token);
    }

    return next.handle(request.clone({headers, params}));
  }
}
