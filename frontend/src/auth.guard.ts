import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { map, Observable } from "rxjs";

@Injectable() 
export class AuthGuard {
    constructor(public _auth: AuthService,
                public router: Router){}
    
    canActivate(route: ActivatedRouteSnapshot, state:RouterStateSnapshot):  boolean|UrlTree | 
                                                                            Observable<boolean|UrlTree> | 
                                                                            Promise<boolean | UrlTree> {
        return this._auth.isAuthenticated$.pipe(map(isLoggedIn => {
            if (!isLoggedIn) {
                return this.router.parseUrl('/401');
            } 
            return true;
        }))
    }

}   