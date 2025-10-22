package com.orderservice.app.feign;

import com.orderservice.app.dto.CartDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CartClientFallback implements CartClient {
    @Override
    public List<CartDTO> getByCustomerId(int userId) {
        return null;
    }

    @Override
    public void deleteByCustomerId(int userId) {
    }
}
