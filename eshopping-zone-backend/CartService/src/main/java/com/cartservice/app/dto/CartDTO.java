
package com.cartservice.app.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class CartDTO {
    private int cartId;
    private double totalPrice;
    private List<ItemDTO> items = new ArrayList<>();
    private int customerId;
}