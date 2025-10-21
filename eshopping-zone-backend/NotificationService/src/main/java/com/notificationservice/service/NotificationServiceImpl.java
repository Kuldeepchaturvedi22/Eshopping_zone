package com.notificationservice.service;


import com.notificationservice.dto.NotificationDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    SimpleMailMessage mailMessage = new SimpleMailMessage();

    @Override
    public ResponseEntity<?> sendMail(NotificationDetails details) {
        mailMessage.setFrom(sender);
        mailMessage.setTo(details.getRecipient());
        mailMessage.setSubject(details.getSubject());
        mailMessage.setText(details.getMsgBody());

        javaMailSender.send(mailMessage);
        return new ResponseEntity<>(true, HttpStatus.OK);
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
    String subject = "Welcome to E-Shopping_zone - Account Verification";
    String body = String.join("\n",
            "Dear User,",
            "",
            "Thank you for registering with our service! Your account has been created successfully.",
            "",
            "Please use the following credentials to log in:",
            "-------------------------------------------",
            "Email: " + email,
            "Password: " + password,
            "-------------------------------------------",
            "",
            "For security reasons, we recommend changing your password after your first login.",
            "",
            "If you have any questions or need assistance, please don't hesitate to contact our support team.",
            "",
            "Best regards,",
            "The Support Team",
            "E-Shopping_zone Inc.",
            "",
            "This is an automated message. Please do not reply to this email."
    );

    // Create new message instance to avoid reusing the same object
    SimpleMailMessage mailMessage = new SimpleMailMessage();
    mailMessage.setFrom(sender);
    mailMessage.setTo(email);
    mailMessage.setSubject(subject);
    mailMessage.setText(body);

    javaMailSender.send(mailMessage);
    return new ResponseEntity<>("Verification email sent successfully", HttpStatus.OK);
}

    @Override
    public ResponseEntity<?> sendPassword(String email, String token) {
        String subject = "Your Password Has Been Reset - E-Shopping_zone";
        String body = String.join("\n",
                "Dear Valued Customer,",
                "",
                "We're writing to confirm that your password has been successfully reset.",
                "",
                "Your new temporary password is:",
                "-------------------------------------------",
                token,
                "-------------------------------------------",
                "",
                "For security reasons, we strongly recommend changing this temporary password immediately after logging in.",
                "",
                "If you did not request this password reset, please contact our support team immediately at support@e-shopping-zone.com or call our customer service at +1-800-123-4567.",
                "",
                "Thank you for choosing E-Shopping_zone for your online shopping needs.",
                "",
                "Best regards,",
                "Customer Security Team",
                "E-Shopping_zone Inc.",
                "",
                "This is an automated message. Please do not reply to this email."
        );

        // Create new message instance to avoid reusing the same object
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(sender);
        mailMessage.setTo(email);
        mailMessage.setSubject(subject);
        mailMessage.setText(body);

        javaMailSender.send(mailMessage);
        return new ResponseEntity<>("Password reset email sent successfully", HttpStatus.OK);
    }
}
