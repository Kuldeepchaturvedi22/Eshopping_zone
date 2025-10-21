package com.example.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentUpdateDTO {
    private int orderId;
    private String paymentId;
    private String paymentStatus;
    private double amount;
    private String paymentMethod;
    private String message;

}
