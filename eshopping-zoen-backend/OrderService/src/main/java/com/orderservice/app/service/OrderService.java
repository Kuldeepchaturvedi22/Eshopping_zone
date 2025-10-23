package com.orderservice.app.service;

import com.orderservice.app.dto.OrderDTO;
import com.orderservice.app.dto.OrderDetailDTO;
import com.orderservice.app.dto.PaymentDto;
import com.orderservice.app.entity.Order;
import com.orderservice.app.entity.Status;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> getAllOrders();

    List<OrderDTO> getOrderByCustomerId(int customerId);

    List<OrderDetailDTO> getDetailedOrdersByCustomerId(int customerId);

    OrderDetailDTO getOrderDetails(int orderId);

    Order placeOrder(String token);

    Order changeOrderStatus(Status orderStatus, int orderId);

    String cancelOrder(int orderId);

    List<Order> getLatestOrdersWithTime(LocalDateTime time);

    Optional<Order> getOrderById(int orderId);

    Order updatePaymentStatus(PaymentDto request);

    List<Order> getAllOrdersByMerchantEmail(String email);
}
