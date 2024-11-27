import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';

@Component({
  selector: 'login-status',
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})

export class LoginStatusComponent implements OnInit{
  isAuthenticated: boolean | undefined = false;
  loggedInUser: any;
  loggedInEmail: string = "";
  storage: Storage = sessionStorage;
  
  
  constructor(public _auth: AuthService){}
  
  ngOnInit(): void {
    if(this._auth.user$) {
      this._auth.user$.subscribe( data => {
        this.loggedInUser = data;
        this.loggedInEmail = data?.email!;
        console.log(this.loggedInUser);
        this.storage.setItem("userEmail", '{"email":' + JSON.stringify(this.loggedInEmail) + '}');
      })
    }
  }
  
  logout(): void {
    this._auth.logout({
      logoutParams: {
        returnTo: window.location.origin, // Redirects to the application's homepage
      },
    });
    
    this.storage.clear();
  }

}
