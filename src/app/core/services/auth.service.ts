import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthenticateResponse, ApiResult } from '../models/base.mdel';
import { AuthHTTPService } from './auth-http.service';
import { environment } from 'src/environments/environment';
import {StorageService} from '../services/storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];
  // public fields
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
     private storageService: StorageService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
  }

  // public methods
  login(email: string, password: string): Observable<any> {
    debugger;
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((response: ApiResult) => {
        if(response.token){
          this.storageService.saveToken(response.token)
          // @ts-ignore
          this.storageService.saveUser({
            token: response.token,
            username: email,            
          });
        }
        return response;
      }),
      //switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    this.storageService.logout();
    this.router.navigate(['/account/login'], {
      queryParams: {},
    });
  }
  public isLogin(): boolean {
    if (this.storageService.getToken()) {
      return true;
    } else return false;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
