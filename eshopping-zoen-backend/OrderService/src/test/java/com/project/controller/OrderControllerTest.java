package com.project.controller;

import com.orderservice.app.controller.OrderServiceController;
import com.orderservice.app.dto.OrderDTO;
import com.orderservice.app.dto.PaymentDto;
import com.orderservice.app.entity.Order;
import com.orderservice.app.entity.Status;
import com.orderservice.app.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OrderControllerTest {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderServiceController orderController;

    @BeforeEach
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testPlaceOrder() {
        String token = "Bearer token";
        Order order = new Order();
        when(orderService.placeOrder(token)).thenReturn(order);

        ResponseEntity<Order> response = orderController.placeOrder(token);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(order, response.getBody());
        verify(orderService).placeOrder(token);
    }

    @Test
    public void testGetAllOrders() {
        List<Order> orders = Arrays.asList(new Order(), new Order());
        when(orderService.getAllOrders()).thenReturn(orders);

        ResponseEntity<List<Order>> response = orderController.getAllOrders();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orders, response.getBody());
        verify(orderService).getAllOrders();
    }

    @Test
    public void testGetOrderByCustomerId() {
        int customerId = 1;
        List<OrderDTO> orderDTOs = Collections.singletonList(new OrderDTO());
        when(orderService.getOrderByCustomerId(customerId)).thenReturn(orderDTOs);

        ResponseEntity<List<OrderDTO>> response = orderController.getOrderByCustomerId(customerId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orderDTOs, response.getBody());
        verify(orderService).getOrderByCustomerId(customerId);
    }

    @Test
    public void testUpdatePaymentStatus() {
        PaymentDto paymentDto = new PaymentDto();
        Order order = new Order();
        when(orderService.updatePaymentStatus(paymentDto)).thenReturn(order);

        ResponseEntity<Order> response = orderController.updatePaymentStatus(paymentDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(order, response.getBody());
        verify(orderService).updatePaymentStatus(paymentDto);
    }

    @Test
    public void testCancelOrder() {
        int orderId = 1;
        String message = "Successfully Deleted";
        when(orderService.cancelOrder(orderId)).thenReturn(message);

        ResponseEntity<String> response = orderController.cancelOrder(orderId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(message, response.getBody());
        verify(orderService).cancelOrder(orderId);
    }

    @Test
    public void testChangeOrderStatus() {
        int orderId = 1;
        Status status = Status.CANCELLED;
        Order order = new Order();
        when(orderService.changeOrderStatus(status, orderId)).thenReturn(order);

        ResponseEntity<Order> response = orderController.changeOrderStatus(status, orderId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(order, response.getBody());
        verify(orderService).changeOrderStatus(status, orderId);
    }

    @Test
    public void testGetOrderById() {
        int orderId = 1;
        Order order = new Order();
        when(orderService.getOrderById(orderId)).thenReturn(Optional.of(order));

        ResponseEntity<Order> response = orderController.getOrderByOrderId(orderId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(order, response.getBody());
        verify(orderService).getOrderById(orderId);
    }

    @Test
    public void testGetLatestOrdersWithTime() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<Order> orders = Arrays.asList(new Order(), new Order());
        when(orderService.getLatestOrdersWithTime(any(LocalDateTime.class))).thenReturn(orders);

        ResponseEntity<List<Order>> response = orderController.getLatestOrderByTime();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orders, response.getBody());
        verify(orderService).getLatestOrdersWithTime(any(LocalDateTime.class));
    }
}