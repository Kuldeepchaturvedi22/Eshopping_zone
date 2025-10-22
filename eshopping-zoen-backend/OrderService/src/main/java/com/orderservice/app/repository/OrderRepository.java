package com.orderservice.app.repository;

import com.orderservice.app.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByCustomerId(int customerId);

    // With DATE-only storage, these are correct and efficient
    List<Order> findByOrderDateAfter(LocalDate date);
    List<Order> findByOrderDate(LocalDate date);
    List<Order> findByOrderDateBetween(LocalDate start, LocalDate end);

    List<Order> findByMerchantEmail(String email);
}