package com.ecommerce.project.dao;

import com.ecommerce.project.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmail(@Param("email") String email);
}
