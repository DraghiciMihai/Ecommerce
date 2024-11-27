package com.ecommerce.project.service;

import com.ecommerce.project.config.SecurityConfiguration;
import com.ecommerce.project.dao.CustomerRepository;
import com.ecommerce.project.dto.PaymentInfo;
import com.ecommerce.project.dto.Purchase;
import com.ecommerce.project.dto.PurchaseResponse;
import com.ecommerce.project.entity.Customer;
import com.ecommerce.project.entity.Order;
import com.ecommerce.project.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private final Logger logger = LoggerFactory.getLogger(getClass().getName());

    CustomerRepository customerRepository;


    public CheckoutServiceImpl(CustomerRepository customerRepository,
                               @Value("${stripe.key.secret}")
                               String secretKey){
        this.customerRepository = customerRepository;
        //initialize Stripe API
        Stripe.apiKey = secretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        Order order = purchase.getOrder();
        
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(order::addItem);

        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        Customer customer;

        Customer customerFromDB = customerRepository.findByEmail(purchase.getCustomer().getEmail());

        if (customerFromDB != null) {
            customer = customerFromDB;
        } else {
            customer = purchase.getCustomer();
        }
        customer.addOrder(order);

        customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");
        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("receipt_email", paymentInfo.getReceiptEmail());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description", "Ecommerce purchase");

        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {
        //TO DO Check for collision in the DB
        return UUID.randomUUID().toString();
    }
}
