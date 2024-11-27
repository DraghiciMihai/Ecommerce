package com.ecommerce.project.controller;

import com.ecommerce.project.dto.PaymentInfo;
import com.ecommerce.project.dto.Purchase;
import com.ecommerce.project.dto.PurchaseResponse;
import com.ecommerce.project.service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final Logger logger = LoggerFactory.getLogger(getClass().getName());

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
        return checkoutService.placeOrder(purchase);
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) throws StripeException {
        logger.info("The amount is: {} and the currency: {}", paymentInfo.getAmount(), paymentInfo.getCurrency());
        PaymentIntent paymentIntent =  checkoutService.createPaymentIntent(paymentInfo);
        String paymentStr = paymentIntent.toJson();
        return new ResponseEntity<>(paymentStr, HttpStatus.OK);
    }
}
