import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private ordersHistoryService: OrderHistoryService){

  }
  ngOnInit(): void {
    this.initializeOrderHistory();
  }

  initializeOrderHistory() {
    const email = JSON.parse(this.storage.getItem("userEmail")!).email;
    console.log(email);
    

    this.ordersHistoryService.getOrderHistory(email).subscribe(
      data => {this.orderHistoryList = data._embedded.orders}
    )
  }

}
