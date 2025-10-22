package com.orderservice.app.feign;

import jakarta.ws.rs.ServiceUnavailableException;
import org.springframework.stereotype.Component;

@Component
public class PaymentClientFallback implements PaymentClient {
    @Override
    public String createPaymentOrder(int amount, int orderId) {
        throw new ServiceUnavailableException("Payment service is currently unavailable");
    }
}