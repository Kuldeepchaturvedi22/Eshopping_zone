package com.userservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
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
	private String modeOfPayment;

	@JsonFormat(pattern = "yyyy-MM-dd", shape = JsonFormat.Shape.STRING)
	private LocalDate orderDate;

	private String orderStatus;
	private int cartId;
    private String merchantEmail;
}