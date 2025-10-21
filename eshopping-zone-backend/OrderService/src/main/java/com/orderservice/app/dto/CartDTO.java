
package com.orderservice.app.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CartDTO {
    private int cartId;
    private double totalPrice;
    private List<ItemDTO> items = new ArrayList<>();
    private int customerId;

    @Override
    public String toString() {
        return "CartDTO{" +
                "cartId=" + cartId +
                ", totalPrice=" + totalPrice +
                ", items=" + items +
                ", customerId=" + customerId +
                '}';
    }
}