import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart-service.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import { FormValidators } from 'src/app/validators/form-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  @ViewChild('cardErrors', { static: false }) cardErrors!: ElementRef;

  storage:Storage = sessionStorage;

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantitiy: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries!: Country[];
  shippingStates!: State[];
  billingStates!: State[];
  userEmail: string = "";
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";
  isDisabled: boolean = false;
  
  constructor(private formBuilder: FormBuilder,
              private formService: FormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router){}

  get firstNameInput() { return this.checkoutFormGroup.get("customer.firstName"); }

  get lastNameInput() { return this.checkoutFormGroup.get("customer.lastName"); }

  get emailInput() { return this.checkoutFormGroup.get("customer.email"); }

  get shippingStreetInput() { return this.checkoutFormGroup.get("shippingAddress.street"); }
  
  get shippingCityInput() { return this.checkoutFormGroup.get("shippingAddress.city"); }

  get shippingZipCodeInput() { return this.checkoutFormGroup.get("shippingAddress.zipCode"); }

  get shippingCountryInput() { return this.checkoutFormGroup.get("shippingAddress.country"); }

  get shippingStateInput() { return this.checkoutFormGroup.get("shippingAddress.state"); }

  get billingStreetInput() { return this.checkoutFormGroup.get("billingAddress.street"); }
  
  get billingCityInput() { return this.checkoutFormGroup.get("billingAddress.city"); }

  get billingZipCodeInput() { return this.checkoutFormGroup.get("billingAddress.zipCode"); }

  get billingCountryInput() { return this.checkoutFormGroup.get("billingAddress.country"); }

  get billingStateInput() { return this.checkoutFormGroup.get("billingAddress.state"); }
  
  get cardTypeInput() { return this.checkoutFormGroup.get("creditCard.cardType");  }

  get nameOnCardInput() { return this.checkoutFormGroup.get("creditCard.nameOnCard"); }

  get cardNumberInput() { return this.checkoutFormGroup.get("creditCard.cardNumber"); }

  get securityCodeInput() { return this.checkoutFormGroup.get("creditCard.securityCode"); }
  
  ngOnInit(): void {

    if (!this.storage.getItem("userEmail")?.includes("undefined") ) {
      this.userEmail =  JSON.parse(this.storage.getItem("userEmail")!).email;
    }

    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({
        // firstName: [''],
        // lastName: [''],
        // email: ['']
        firstName: new FormControl("", [Validators.required, Validators.minLength(2), FormValidators.onlyWhiteSpace]),
        lastName: new FormControl("", [Validators.required, Validators.minLength(2)]),
        email: new FormControl(this.userEmail, [Validators.required, Validators.pattern('^[a-z0-9.%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl("", [Validators.required, Validators.minLength(2), FormValidators.onlyWhiteSpace]),
        city: new FormControl("", [Validators.required, Validators.minLength(2), FormValidators.onlyWhiteSpace]),
        state: new FormControl("", [Validators.required]),
        country: new FormControl("", [Validators.required]),
        zipCode: new FormControl("", [Validators.required, Validators.minLength(2), FormValidators.onlyWhiteSpace])
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl("", [Validators.required, Validators.minLength(2), FormValidators.onlyWhiteSpace]),
        city: new FormControl("", [Validators.required, Validators.minLength(2), FormValidators.onlyWhiteSpace]),
        state: new FormControl("", [Validators.required]),
        country: new FormControl("", [Validators.required]),
        zipCode: new FormControl("", [Validators.required, Validators.minLength(2), FormValidators.onlyWhiteSpace])
      }),

      creditCard: this.formBuilder.group({
        // cardType: new FormControl("", [Validators.required]),
        // nameOnCard: new FormControl("", [Validators.required, Validators.minLength(2), FormValidators.onlyWhiteSpace]),
        // cardNumber: new FormControl("", [Validators.required, FormValidators.cardNumberValidator]),
        // securityCode: new FormControl("", [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        // expirationMonth: [''],
        // expirationYear: ['']
      })

    });

    /* const currMonth = new Date().getMonth() + 1;
    this.formService.getCreditCardMonths(currMonth).subscribe(data => {
      this.creditCardMonths = data;
    })
    this.formService.getCreditCardYears().subscribe(data => {
      this.creditCardYears = data;
    }) */

    this.formService.getCountries().subscribe(data => {
      this.countries = data;
    })

    this.reviewCartDetails();

    this.setupStripePaymentForm();
    
  }

  setupStripePaymentForm() {
    // get stripe elements
    var elements = this.stripe.elements();

    //create card element
    this.cardElement = elements.create("card", {hidePostalCode: true});

    //add instance of card UI component into the #card-element
    this.cardElement.mount('#card-element');

    // add event biding
    this.cardElement.on('change', (event: any) => {
      this.displayError =  document.getElementById("card-errors");
      // this.displayError =  this.cardErrors.nativeElement;
    
        if (event.complete) {
          this.displayError.textContent = ""; // Clear error
        } else if (event.error) {
          console.log(event);
          this.displayError.textContent = event.error?.message; // Display error message
          console.log(this.displayError.textContent);
          
        }

    });
  }

  private reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(data => this.totalQuantitiy = data);
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
  }

  getStates(formGroup: string) {
      const countryCode = this.checkoutFormGroup.controls[`${formGroup}`]?.value.country.code;
      console.log(countryCode);
      
      this.formService.getStatesByCountryCode(countryCode).subscribe(data => {
        formGroup === "shippingAddress" ? this.shippingStates = this.billingStates = data : this.billingStates = data;
        this.checkoutFormGroup.get(formGroup)?.get("state")?.setValue(data[0]);
      })

  }

  onCardNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/g,''); // Remove all spaces and non digits
    value = value.replace(/(\d{4})/g, '$1 ').trim(); // Add space after every 4 digits

    input.value = value;
  }
  
  copyShippingToBillingAddress(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const shippingAddress = this.checkoutFormGroup.controls["shippingAddress"].value;

    console.log('Billing Address Before:', this.checkoutFormGroup.controls["billingAddress"].value);
    if(checkbox.checked){
      this.billingStates = this.shippingStates;
      this.checkoutFormGroup.controls["billingAddress"].setValue(shippingAddress);
    } else {
      this.checkoutFormGroup.controls["billingAddress"].reset();
      this.billingStates = [];
    }
    console.log('Billing Address After:', this.checkoutFormGroup.controls["billingAddress"].value);
  }

  handleMonthExpirationDate() {
      const creditCardFG = this.checkoutFormGroup.get("creditCard");

      const currYear: number = new Date().getFullYear();
      const selectedYear: number = +creditCardFG?.value.expirationYear;

      let startMonth = currYear === selectedYear ? new Date().getMonth() + 1 : 1;
        
      this.formService.getCreditCardMonths(startMonth).subscribe(data => {
        this.creditCardMonths = data;
      })
  }

  submit() {
    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    } 

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantitiy;

    const cartItems = this.cartService.cartItems;
    
    let orderItems : OrderItem[] = [];
    orderItems = cartItems.map(tempCartItem => new OrderItem(tempCartItem)) // short and clearer version
    // for(let i=0; i<cartItems.length; i++) {
    //   orderItems[i] = new OrderItem(cartItems[i])
    // } // Long version
    // cartItems.forEach(tempCartItem => orderItems.push(new OrderItem(tempCartItem))); //short verision
    //set up purchase
    let purchase = new Purchase();

    //populate customer
    purchase.customer = this.checkoutFormGroup.get("customer")?.value;
    
    
    //populate shipping address
    purchase.shippingAddress = this.checkoutFormGroup.get("shippingAddress")?.value;
    console.log(`purchase.shippingAddress before:`);
    console.log(JSON.stringify (purchase.shippingAddress));
    if (purchase.shippingAddress){
      const shippingStateName: string = this.checkoutFormGroup.get("billingAddress.state")?.value.name;
      const shippingCountryName: string = this.checkoutFormGroup.get("billingAddress.country")?.value.name;
      // const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
      // const shippingCountry: Country = JSON.parse(JSON.stringify(this.checkoutFormGroup.get("shippingAddress")?.value.country));
      console.log(shippingStateName);
      console.log(shippingCountryName);

      purchase.shippingAddress.state = shippingStateName;
      purchase.shippingAddress.country = shippingCountryName;
    }
    console.log(`purchase.shippingAddress after:`);
    console.log(JSON.stringify (purchase.shippingAddress));
    
    
    //populate billing address
    purchase.billingAddress = this.checkoutFormGroup.get("billingAddress")?.value;
    console.log(`purchase.billingAddress before:`);
    console.log(JSON.stringify (purchase.billingAddress));
    if(purchase.billingAddress){
      const billingStateName: string = this.checkoutFormGroup.get("billingAddress.state")?.value.name;
      const billingCountryName: string = this.checkoutFormGroup.get("billingAddress.country")?.value.name;

      purchase.billingAddress.state = billingStateName;
      purchase.billingAddress.country = billingCountryName;
    }
    console.log(`purchase.billingAddress after:`);
    console.log(JSON.stringify (purchase.billingAddress));


    //populate order and items
    purchase.order = order;
    purchase.orderItems = orderItems;

    //populate payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer?.email;
    console.log(`The amount is: ${JSON.stringify(this.paymentInfo)}`);
    

    console.log(this.checkoutFormGroup.value);

    //create payment intent
    //confirm card payment
    //place order

    if(!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
      this.isDisabled = true;
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer?.email,
                  name: `${purchase.customer?.firstName} ${purchase.customer?.lastName}`,
                  address: {
                    line1: purchase.billingAddress?.street,
                    city: purchase.billingAddress?.city,
                    state: purchase.billingAddress?.state,
                    postal_code: purchase.billingAddress?.zipCode,
                    country: this.billingCountryInput?.value.code
                  }
                }
              }
            }, { handleActions: false}).then((result: any) => {
              if (result.error) {
                //inform the user
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                //call the REST API
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received.\nOrder tracking number is ${response.orderTrackingNumber}.`);
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (err) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  }
                }
                )
              }
            })
        }
      )} else {
        this.checkoutFormGroup.markAllAsTouched();
        this.isDisabled = false;
        return;
      }
  }

  resetCart() {
    //reset cart
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    //reset form
    this.checkoutFormGroup.reset();

    //redirect
    this.router.navigateByUrl("/products");
  }

}
