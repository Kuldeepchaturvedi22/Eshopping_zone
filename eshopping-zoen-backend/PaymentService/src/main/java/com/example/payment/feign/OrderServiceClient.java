package com.example.payment.feign;

import com.example.payment.dto.Payment;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ORDERSERVICE")
public interface OrderServiceClient {
    @PutMapping("/orders/update-payment-status")
    void updatePaymentStatus(@RequestBody Payment request);
}
