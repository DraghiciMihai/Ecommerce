import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
  }
  getOrderHistory(email: string): Observable<GetResponseOrderHistory>{
    const searchUrl = `${this.baseUrl}/orders/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`

    return this.httpClient.get<GetResponseOrderHistory>(searchUrl);
  }
}
interface GetResponseOrderHistory{
  _embedded: {
    orders: OrderHistory[];
  }
}
