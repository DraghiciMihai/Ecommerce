import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { 
  }

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(`${this.baseUrl}/checkout/purchase`, purchase)
  }

  createPaymentIntent(paymentInfo: PaymentInfo) : Observable<any> {
    return this.httpClient.post<PaymentInfo>(`${this.baseUrl}/checkout/payment-intent`, paymentInfo)
  } 
}
