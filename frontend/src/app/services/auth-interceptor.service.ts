import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { INITIAL_AUTH_STATE } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(public _auth: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const securedEndpoints = [`${environment.apiUrl}/orders`];

    if (securedEndpoints.some((url) => request.urlWithParams.includes(url))) {
      
      // Use `switchMap` to handle the observable from `getAccessTokenSilently`
      return this._auth.getAccessTokenSilently().pipe(
        switchMap((token) => {
          if (token) {
            request = request.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            });
          }
          return next.handle(request);
        })
      );
    }

    // Pass through requests to non-secured endpoints
    return next.handle(request);
  }
}
