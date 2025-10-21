
package com.cartservice.app.dto;

import lombok.Data;

@Data
public class ItemDTO {
    private int itemId;
    private String itemType;
    private String itemName;
    private String category;
    private String image;
    private double price;
    private String description;
    private double discount;
    private int quantity;
    private int productId;
    private String merchantEmail;
}