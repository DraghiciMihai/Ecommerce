import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit{


  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService){}

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.cartItems = this.cartService.cartItems;
    console.log(this.cartItems);
    

    this.cartService.totalPrice.subscribe((data: number) => {      
      this.totalPrice = +data.toFixed(2);
    });

    this.cartService.totalQuantity.subscribe(data => {      
      this.totalQuantity = data;
    });

    this.cartService.computeCartTotals();
  }

  increment(item: CartItem) {
    this.cartService.addToCart(item);
  }

  decrement(item: CartItem) {
    this.cartService.decrementQuantity(item);
  }

  remove(item: CartItem) {
    this.cartService.removeItem(item);
  }

}
