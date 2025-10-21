package com.orderservice.app.controller;

import com.orderservice.app.dto.OrderDTO;
import com.orderservice.app.dto.PaymentDto;
import com.orderservice.app.entity.Order;
import com.orderservice.app.entity.Status;
import com.orderservice.app.exception.OrderNotFoundException;
import com.orderservice.app.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderServiceController {

    @Autowired
    private OrderService orderService;


    @Operation(summary = "Get all orders")
    @GetMapping("/getAllOrders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @Operation(summary = "Get all order for merchant")
    @GetMapping("/getAllOrdersByMerchantEmail")
    public ResponseEntity<List<Order>> getAllOrdersByMerchantEmail(@RequestParam String email) {
        List<Order> orders = orderService.getAllOrdersByMerchantEmail(email);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }


    @Operation(summary = "Get orders by customer ID")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDTO>> getOrderByCustomerId(@PathVariable int customerId) {
        List<OrderDTO> orders = orderService.getOrderByCustomerId(customerId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/update-payment-status")
    public ResponseEntity<Order> updatePaymentStatus(@RequestBody PaymentDto request) {
        Order updatedOrder = orderService.updatePaymentStatus(request);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }

    @Operation(summary = "Place a new order")
    @PostMapping("/placeOrder")
    public ResponseEntity<Order> placeOrder(@RequestHeader("Authorization") String token) {
        Order orders = orderService.placeOrder(token);
        return new ResponseEntity<>(orders, HttpStatus.CREATED);
    }

    @Operation(summary = "Change order status")
    @PutMapping("changeOrderStatus/{orderId}")
    public ResponseEntity<Order> changeOrderStatus(@Valid @RequestBody Status orderStatus, @PathVariable int orderId) {
        Order orders = orderService.changeOrderStatus(orderStatus, orderId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @Operation(summary = "Cancel an order")
    @DeleteMapping("cancelOrder/{orderId}")
    public ResponseEntity<String> cancelOrder(@PathVariable int orderId) {
        String orders = orderService.cancelOrder(orderId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }


    @Operation(summary = "Get latest orders placed within the last hour")
    @GetMapping("/latest-orders")
    public ResponseEntity<List<Order>> getLatestOrderByTime() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<Order> recentOrders = orderService.getLatestOrdersWithTime(oneHourAgo);
        return ResponseEntity.ok(recentOrders);
    }

    @Operation(summary = "Get order by order ID")
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderByOrderId(@PathVariable int orderId) {
        return orderService.getOrderById(orderId).map(ResponseEntity::ok).orElseThrow(() -> new OrderNotFoundException(orderId + " not found"));
    }

}