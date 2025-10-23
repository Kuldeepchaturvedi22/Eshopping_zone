package com.notificationservice.service;

import com.notificationservice.dto.NotificationDetails;
import org.springframework.http.ResponseEntity;
import java.util.Map;

public interface NotificationService {
    ResponseEntity<?> sendMail(NotificationDetails details);
    
    ResponseEntity<?> registerUser(String email, String password);
    
    ResponseEntity<?> sendPassword(String email, String token);
    
    ResponseEntity<?> sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> templateData, byte[] pdfAttachment, String attachmentName);
    
    ResponseEntity<?> sendOrderConfirmation(String email, Map<String, Object> orderData);
    
    ResponseEntity<?> sendPaymentSuccess(String email, Map<String, Object> orderData);
    
    ResponseEntity<?> sendOrderStatusUpdate(String email, Map<String, Object> orderData);
    
    ResponseEntity<?> sendMerchantOrderNotification(String merchantEmail, Map<String, Object> orderData);
    
    ResponseEntity<?> sendLoginNotification(String email, Map<String, Object> loginData);
    
    ResponseEntity<?> sendWelcomeEmail(String email, String userName);
}
