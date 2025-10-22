package com.orderservice.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private int orderId;

    private double amountPaid;

    private int customerId;

    private String merchantEmail;

    private String modeOfPayment;

    private LocalDate orderDate;

    private String orderStatus;

    private int cartId;
}
