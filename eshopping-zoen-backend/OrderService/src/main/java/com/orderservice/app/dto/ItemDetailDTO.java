package com.orderservice.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDetailDTO {
    private String itemName;
    private String itemType;
    private double price;
    private int quantity;
    private int productId;
    private String merchantEmail;
}
