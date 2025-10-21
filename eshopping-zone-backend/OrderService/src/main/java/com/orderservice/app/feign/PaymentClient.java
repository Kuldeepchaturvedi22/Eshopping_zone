package com.orderservice.app.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "PAYMENTSERVICE", fallback = PaymentClientFallback.class)
public interface PaymentClient {
    @PostMapping("/payment/create-order")
    String createPaymentOrder(@RequestParam("amount") int amount,
                              @RequestParam("orderId") int orderId);
}