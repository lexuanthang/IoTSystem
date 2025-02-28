import { environment } from '../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeleteModelRequest, PagingRequest, ResetPasswordVm } from '../models/base.model';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    baseUrl = `${environment.apiUrl}/api/admin/`;

    constructor(private http: HttpClient) {
    }
    changepassword(passwordModel: any): Observable<any> {
        const url = this.baseUrl + "changepassword";
        return this.http
            .post<any>(url, passwordModel)
            .pipe();
    }
    checkChangePassword(): Observable<any> {
      const url = this.baseUrl + "checkchangepassword";
      return this.http.get<any>(url);
    }

      filterUser(tenantId: any, request: PagingRequest = null): Observable<User[]> {
        let qs = '';
        if (request) {
            qs = Object.keys(request)
                .map(key => `${key}=${request[key]}`)
                .join('&');
        }
        return this.http
          .get<User[]>(this.baseUrl + `filterusers?tenantId=${tenantId}&${qs}`)
          .pipe(catchError(() => of([])));
      }
    
     
}
