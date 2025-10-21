package com.example.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    private int orderId;
    private String razorpayId;
    private String paymentId;
    private String paymentStatus;
    private double amount;
    private String paymentMethod;
    private String transactionDetails;
}

