package com.userservice.feign;

import com.userservice.dto.CartDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class CartClientFallback implements CartClient {
    @Override
    public List<CartDTO> getCartByCustomerId(@PathVariable("customerId") int customerId) {
        CartDTO emptyCart = new CartDTO();
        emptyCart.setCustomerId(customerId);
        emptyCart.setItems(new ArrayList<>());
        emptyCart.setTotalPrice(0.0);
        return Collections.singletonList(emptyCart);
    }
}