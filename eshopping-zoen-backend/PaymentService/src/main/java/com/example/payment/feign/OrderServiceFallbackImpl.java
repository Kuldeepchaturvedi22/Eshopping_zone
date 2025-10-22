package com.example.payment.feign;

import com.example.payment.dto.Payment;
import jakarta.ws.rs.ServiceUnavailableException;
import org.springframework.stereotype.Component;

@Component
public class OrderServiceFallbackImpl implements OrderServiceClient {
    @Override
    public void updatePaymentStatus(Payment request) {
        throw new ServiceUnavailableException("Order service is currently unavailable");
    }
}