import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  public cartItems: CartItem[] = [];
  
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  
  storage: Storage = sessionStorage;
  
  constructor() { 
    
    this.cartItems = JSON.parse(this.storage.getItem("cartItems")!) ?? [];
    this.cartItems.length && this.computeCartTotals();
    
  }
  
  addToCart(newCartItem: CartItem) {
    let theCartItem: CartItem | undefined = undefined;
    let isInTheCart: boolean = false;
    
    if(this.cartItems){
      theCartItem = this.cartItems.find(tempCartItem => tempCartItem.id == newCartItem.id);
      isInTheCart = theCartItem != undefined;
    }
    
    if (isInTheCart) {
      theCartItem!.quantity++;
    } else {
      this.cartItems.push(newCartItem);
    }
    
    this.computeCartTotals();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue : number = 0;

    for (let tempCartItem of this.cartItems) {
      totalPriceValue += tempCartItem.unitPrice * tempCartItem.quantity;
      totalQuantityValue += tempCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);

    this.persistCartItems();

  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("Contents of the cart");
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.unitPrice * tempCartItem.quantity;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice},
         subTotalPrice: ${tempCartItem.quantity * tempCartItem.unitPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuatity: ${totalQuantityValue}`);
    console.log(`----------`);    
  }

  decrementQuantity(item: CartItem) {
    item.quantity--;

    if (item.quantity === 0) { this.removeItem(item)}
  }

  removeItem(item: CartItem) {
    const index = this.cartItems.findIndex(temp => temp.id == item.id)
    if (index > -1) { this.cartItems.splice(index, 1)}
    this.computeCartTotals();
  }
}
