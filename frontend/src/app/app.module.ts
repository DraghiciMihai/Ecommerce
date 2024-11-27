import { Inject, inject, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { Routes, RouterModule, Router} from '@angular/router';
import { ProductCategoryMenu } from './components/product-category-menu/product-category-menu.component'
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import { AuthGuard, AuthModule, AuthService } from '@auth0/auth0-angular';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';

const routes : Routes = [
  {path: "category/:id/:name", component: ProductListComponent},
  {path: "cart-details", component: CartDetailsComponent},
  {path: "order-history", component: OrderHistoryComponent, canActivate:[AuthGuard]},
  {path: "checkout", component: CheckoutComponent},
  {path: "products/:id", component: ProductDetailsComponent},
  {path: "search/:keyword", component: ProductListComponent},
  {path: "members", component: MembersPageComponent, canActivate:[AuthGuard]},
  {path: "category", component: ProductListComponent},
  {path: "products", component: ProductListComponent},
  {path: "401", component: NotAuthorizedComponent},
  {path: "", redirectTo: "/products", pathMatch: "full"},
  {path: "**", redirectTo: "/products", pathMatch: "full"}
];

@NgModule({
  declarations: [
    LoginStatusComponent,
    AppComponent,
    ProductListComponent,
    ProductCategoryMenu,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    MembersPageComponent,
    NotAuthorizedComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain: 'dev-7mp44imv6zpqc0wh.us.auth0.com',
      clientId: 'bUsGzsE0xYr8xebkS5MEjvtMGb1JlGic',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://dev-7mp44imv6zpqc0wh.us.auth0.com/api/v2/',
        scope: 'openid profile email', // Specify the scopes required
      },
      useRefreshTokens: true, // Enables refresh tokens to keep the user logged in
      cacheLocation: 'localstorage'
    })
  ],
  providers: [ProductService,
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
