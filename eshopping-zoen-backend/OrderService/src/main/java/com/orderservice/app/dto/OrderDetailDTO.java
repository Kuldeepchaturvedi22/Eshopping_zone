package com.orderservice.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailDTO {
    private int orderId;
    private double amountPaid;
    private int customerId;
    private String merchantEmail;
    private String modeOfPayment;
    private LocalDate orderDate;
    private String orderStatus;
    private int cartId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String paymentLink;
    
    // Payment details
    private PaymentDetailDTO payment;
    
    // Address details
    private AddressDetailDTO address;
    
    // Cart items
    private CartDetailDTO cart;
}

