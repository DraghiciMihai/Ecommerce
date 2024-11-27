package com.ecommerce.project.service;

import com.ecommerce.project.dto.PaymentInfo;
import com.ecommerce.project.dto.Purchase;
import com.ecommerce.project.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
