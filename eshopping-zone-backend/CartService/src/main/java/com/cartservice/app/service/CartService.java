package com.cartservice.app.service;

import com.cartservice.app.dto.CartDTO;
import com.cartservice.app.entity.Cart;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CartService {
    ResponseEntity<Cart> getOrCreateCart(String token);

    ResponseEntity<Cart> addItem(int itemId, String token);

    void removeItem(String token, int itemId);

    ResponseEntity<Cart> getcartById(int cartId);

    ResponseEntity<Cart> updateCart(int cartId, @Valid Cart cart);

    ResponseEntity<List<Cart>> getallcarts();

    ResponseEntity<Cart> addCart(@Valid Cart cart);

    ResponseEntity<String> deleteCart(int cartId);

    ResponseEntity<String> deleteByCustomerId(int userId);

    List<CartDTO> getByCustomerId(int customerId);
}