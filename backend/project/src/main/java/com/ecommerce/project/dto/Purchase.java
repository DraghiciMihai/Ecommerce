package com.ecommerce.project.dto;

import com.ecommerce.project.entity.Address;
import com.ecommerce.project.entity.Customer;
import com.ecommerce.project.entity.Order;
import com.ecommerce.project.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
