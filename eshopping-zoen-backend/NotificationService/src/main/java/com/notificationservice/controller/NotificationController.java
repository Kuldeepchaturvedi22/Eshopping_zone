package com.notificationservice.controller;


import com.notificationservice.dto.NotificationDetails;
import com.notificationservice.service.NotificationServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private NotificationServiceImpl notificationService;

    @Operation (summary = "Send email notification")
    @PostMapping("/sendMail")
    public ResponseEntity<?> sendMail(@RequestBody NotificationDetails details) {
        System.out.println(details);
        return notificationService.sendMail(details);
    }

    @Operation (summary = "Send SMS notification")
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody String email, @RequestParam String token) {
        notificationService.registerUser(email, token);
        return ResponseEntity.ok("User registered successfully and email sent");
    }

    @Operation (summary = "Send password")
    @PostMapping("/forgotPassword")
    public ResponseEntity<?> forgotPassword(@RequestBody String email, @RequestParam String token) {
        return notificationService.sendPassword(email,token);
    }

    @Operation(summary = "Send order confirmation email")
    @PostMapping("/order-confirmation")
    public ResponseEntity<?> sendOrderConfirmation(@RequestParam String email, @RequestBody Map<String, Object> orderData) {
        return notificationService.sendOrderConfirmation(email, orderData);
    }

    @Operation(summary = "Send payment success email with PDF receipt")
    @PostMapping("/payment-success")
    public ResponseEntity<?> sendPaymentSuccess(@RequestParam String email, @RequestBody Map<String, Object> orderData) {
        return notificationService.sendPaymentSuccess(email, orderData);
    }

    @Operation(summary = "Send order status update email")
    @PostMapping("/order-status-update")
    public ResponseEntity<?> sendOrderStatusUpdate(@RequestParam String email, @RequestBody Map<String, Object> orderData) {
        return notificationService.sendOrderStatusUpdate(email, orderData);
    }

    @Operation(summary = "Send merchant notification for new orders")
    @PostMapping("/merchant-order-notification")
    public ResponseEntity<?> sendMerchantOrderNotification(@RequestParam String merchantEmail, @RequestBody Map<String, Object> orderData) {
        return notificationService.sendMerchantOrderNotification(merchantEmail, orderData);
    }

    @Operation(summary = "Send login notification email")
    @PostMapping("/login-notification")
    public ResponseEntity<?> sendLoginNotification(@RequestParam String email, @RequestBody Map<String, Object> loginData) {
        return notificationService.sendLoginNotification(email, loginData);
    }

    @Operation(summary = "Send welcome email after registration")
    @PostMapping("/welcome")
    public ResponseEntity<?> sendWelcomeEmail(@RequestParam String email, @RequestParam String userName) {
        return notificationService.sendWelcomeEmail(email, userName);
    }
}
