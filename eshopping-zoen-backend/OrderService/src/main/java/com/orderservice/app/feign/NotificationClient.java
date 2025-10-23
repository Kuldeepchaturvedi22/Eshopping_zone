package com.orderservice.app.feign;

import com.orderservice.app.entity.NotificationDetails;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Map;

@FeignClient(name = "NOTIFICATIONSERVICE", fallback = NotificationClientFallback.class)
public interface NotificationClient {

    @PostMapping("/notification/sendMail")
    String sendEmail(@RequestBody NotificationDetails notificationDetails);

    @PostMapping("/notification/order-confirmation")
    String sendOrderConfirmation(@RequestParam String email, @RequestBody Map<String, Object> orderData);

    @PostMapping("/notification/payment-success")
    String sendPaymentSuccess(@RequestParam String email, @RequestBody Map<String, Object> orderData);

    @PostMapping("/notification/order-status-update")
    String sendOrderStatusUpdate(@RequestParam String email, @RequestBody Map<String, Object> orderData);

    @PostMapping("/notification/merchant-order-notification")
    String sendMerchantOrderNotification(@RequestParam String merchantEmail, @RequestBody Map<String, Object> orderData);
}
