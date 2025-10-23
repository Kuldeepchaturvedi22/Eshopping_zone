package com.orderservice.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDetailDTO {
    private String paymentId;
    private String paymentStatus;
    private String paymentMethod;
    private double amount;
}
