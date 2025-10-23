package com.notificationservice.service;


import com.notificationservice.dto.NotificationDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private PdfReceiptService pdfReceiptService;

    @Value("${spring.mail.username}")
    private String sender;

    SimpleMailMessage mailMessage = new SimpleMailMessage();

    @Override
    public ResponseEntity<?> sendMail(NotificationDetails details) {
        try {
            mailMessage.setFrom(sender);
            mailMessage.setTo(details.getRecipient());
            mailMessage.setSubject(details.getSubject());
            mailMessage.setText(details.getMsgBody());

            javaMailSender.send(mailMessage);
            return new ResponseEntity<>("Email sent successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to send email: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @Override
//    public ResponseEntity<?> registerUser(String email, String password) {
//        String subject = "Verify your email";
//        String body = "Dear user,\n\nUse this password below:\n" + password + "\n\n for login \n\nThank you!";
//
//        //SimpleMailMessage mailMessage = new SimpleMailMessage();
//        mailMessage.setFrom(sender);
//        mailMessage.setTo(email);
//        mailMessage.setSubject(subject);
//        mailMessage.setText(body);
//
//        javaMailSender.send(mailMessage);
//        return new ResponseEntity<>("Verification email sent successfully", HttpStatus.OK);
//    }
@Override
public ResponseEntity<?> registerUser(String email, String password) {
    try {
        Context context = new Context();
        context.setVariable("email", email);
        context.setVariable("userName", email.split("@")[0]); // Extract username from email
        
        String htmlContent = templateEngine.process("registration-welcome", context);
        
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        
        helper.setFrom(sender);
        helper.setTo(email);
        helper.setSubject("Welcome to E-Shopping Zone! 🎉 Account Created Successfully");
        helper.setText(htmlContent, true);
        
        javaMailSender.send(mimeMessage);
        return new ResponseEntity<>("Welcome email sent successfully", HttpStatus.OK);
    } catch (MessagingException e) {
        return new ResponseEntity<>("Failed to send welcome email: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    @Override
    public ResponseEntity<?> sendPassword(String email, String token) {
        try {
            Context context = new Context();
            context.setVariable("email", email);
            context.setVariable("userName", email.split("@")[0]);
            context.setVariable("resetToken", token);
            
            String htmlContent = templateEngine.process("password-reset", context);
            
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(sender);
            helper.setTo(email);
            helper.setSubject("🔐 Password Reset Request - E-Shopping Zone");
            helper.setText(htmlContent, true);
            
            javaMailSender.send(mimeMessage);
            return new ResponseEntity<>("Password reset email sent successfully", HttpStatus.OK);
        } catch (MessagingException e) {
            return new ResponseEntity<>("Failed to send password reset email: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // New method for sending HTML emails with optional PDF attachment
    public ResponseEntity<?> sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> templateData, byte[] pdfAttachment, String attachmentName) {
        try {
            Context context = new Context();
            context.setVariables(templateData);
            
            String htmlContent = templateEngine.process(templateName, context);
            
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(sender);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            // Add PDF attachment if provided
            if (pdfAttachment != null && attachmentName != null) {
                helper.addAttachment(attachmentName, new ByteArrayResource(pdfAttachment));
            }
            
            javaMailSender.send(mimeMessage);
            return new ResponseEntity<>("Email sent successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to send email: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Method for sending order confirmation with payment link
    public ResponseEntity<?> sendOrderConfirmation(String email, Map<String, Object> orderData) {
        String orderId = String.valueOf(orderData.get("orderId"));
        String subject = "🛒 Order Placed Successfully #" + orderId + " - Complete Payment";
        return sendHtmlEmail(email, subject, "order-confirmation", orderData, null, null);
    }

    // Method for sending payment success with PDF receipt
    public ResponseEntity<?> sendPaymentSuccess(String email, Map<String, Object> orderData) {
        try {
            String orderId = String.valueOf(orderData.get("orderId"));
            String subject = "✅ Payment Successful - Order #" + orderId + " Confirmed";
            
            // Generate PDF receipt
            byte[] pdfReceipt = pdfReceiptService.generateReceipt(orderData);
            String receiptFileName = "Receipt_Order_" + orderId + ".pdf";
            
            return sendHtmlEmail(email, subject, "payment-success", orderData, pdfReceipt, receiptFileName);
        } catch (Exception e) {
            // Fallback to email without PDF if PDF generation fails
            String orderId = String.valueOf(orderData.get("orderId"));
            String subject = "✅ Payment Successful - Order #" + orderId + " Confirmed";
            return sendHtmlEmail(email, subject, "payment-success", orderData, null, null);
        }
    }

    // Method for sending order status updates
    public ResponseEntity<?> sendOrderStatusUpdate(String email, Map<String, Object> orderData) {
        String status = (String) orderData.get("orderStatus");
        String orderId = String.valueOf(orderData.get("orderId"));
        String emoji = getStatusEmoji(status);
        String subject = emoji + " Order #" + orderId + " Status: " + status;
        return sendHtmlEmail(email, subject, "order-status-update", orderData, null, null);
    }

    private String getStatusEmoji(String status) {
        switch (status.toUpperCase()) {
            case "PLACED": return "📋";
            case "CONFIRMED": return "✅";
            case "SHIPPED": return "🚚";
            case "DELIVERED": return "📦";
            case "CANCELLED": return "❌";
            default: return "📋";
        }
    }

    // Method for sending merchant notifications about new orders
    public ResponseEntity<?> sendMerchantOrderNotification(String merchantEmail, Map<String, Object> orderData) {
        String orderId = String.valueOf(orderData.get("orderId"));
        String subject = "🔔 New Order Alert #" + orderId + " - Action Required";
        return sendHtmlEmail(merchantEmail, subject, "merchant-order-notification", orderData, null, null);
    }

    // Method for sending login notification
    public ResponseEntity<?> sendLoginNotification(String email, Map<String, Object> loginData) {
        return sendHtmlEmail(email, "Login Alert - E-Shopping Zone", "login-notification", loginData, null, null);
    }

    // Method for sending welcome email after successful registration
    public ResponseEntity<?> sendWelcomeEmail(String email, String userName) {
        try {
            Context context = new Context();
            context.setVariable("userName", userName);
            context.setVariable("email", email);
            
            String htmlContent = templateEngine.process("registration-welcome", context);
            
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(sender);
            helper.setTo(email);
            helper.setSubject("Welcome to E-Shopping Zone! 🎉");
            helper.setText(htmlContent, true);
            
            javaMailSender.send(mimeMessage);
            return new ResponseEntity<>("Welcome email sent successfully", HttpStatus.OK);
        } catch (MessagingException e) {
            return new ResponseEntity<>("Failed to send welcome email: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
