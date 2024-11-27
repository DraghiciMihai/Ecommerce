import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'cart-status',
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartService){}

  ngOnInit(): void {
   this.updateStatus();
  }

  updateStatus() {
    this.cartService.totalPrice.subscribe((data: number) => {
      this.totalPrice = +data.toFixed(2);
    });
    
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    });
  }

}
