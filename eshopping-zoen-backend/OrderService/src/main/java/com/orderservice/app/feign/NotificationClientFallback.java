package com.orderservice.app.feign;

import com.orderservice.app.entity.NotificationDetails;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class NotificationClientFallback implements NotificationClient {
   @Override
    public String sendEmail(NotificationDetails notificationDetails) {
         return "Notification service is not available";
    }

    @Override
    public String sendOrderConfirmation(String email, Map<String, Object> orderData) {
        return "Notification service is not available";
    }

    @Override
    public String sendPaymentSuccess(String email, Map<String, Object> orderData) {
        return "Notification service is not available";
    }

    @Override
    public String sendOrderStatusUpdate(String email, Map<String, Object> orderData) {
        return "Notification service is not available";
    }

    @Override
    public String sendMerchantOrderNotification(String merchantEmail, Map<String, Object> orderData) {
        return "Notification service is not available";
    }
}
