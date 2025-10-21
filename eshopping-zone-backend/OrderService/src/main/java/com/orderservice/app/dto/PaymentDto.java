package com.orderservice.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDto {
//    private String orderId;
    private int orderId;
    private String razorpayId;
    private String paymentId;
    private String paymentStatus;
    private double amount;
    private String paymentMethod;
    private String transactionDetails;
}

