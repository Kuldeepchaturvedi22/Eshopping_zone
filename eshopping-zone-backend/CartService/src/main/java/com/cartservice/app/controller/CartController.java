package com.cartservice.app.controller;

import com.cartservice.app.dto.CartDTO;
import com.cartservice.app.entity.Cart;
import com.cartservice.app.exception.CartServiceException;
import com.cartservice.app.mapper.CartMapper;
import com.cartservice.app.repository.CartRepository;
import com.cartservice.app.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/carts")
@NoArgsConstructor
public class CartController {

    @Autowired
    CartService cartService;

    @Operation(summary = "Get carts by customer ID")
    @GetMapping("/getByCustomerId/{customerId}")
    public List<CartDTO> getByCustomerId(@PathVariable("customerId") int customerId) {
        return cartService.getByCustomerId(customerId);
    }


    @Operation(summary = "Get a cart by ID")
    @GetMapping("getByCartId/{cartId}")
    public ResponseEntity<Cart> getCart(@PathVariable("cartId") int cartId) {

        return cartService.getcartById(cartId);
    }


    @Operation(summary = "Update a cart")
    @PutMapping("updateCart/{cartId}")
    public ResponseEntity<Cart> updateCart(@PathVariable("cartId") int cartId, @RequestBody @Valid Cart cart) {
        return cartService.updateCart(cartId, cart);
    }


    @Operation(summary = "Get all carts")
    @GetMapping("/getAllCarts")
    public ResponseEntity<List<Cart>> getAllCarts() {
        return cartService.getallcarts();
    }


    @Operation(summary = "Delete a cart")
    @DeleteMapping("deleteCart/{cartId}")
    public ResponseEntity<String> deleteCart(@PathVariable("cartId") int cartId) {
        return cartService.deleteCart(cartId);
    }

    @Operation(summary = "Delete a cart by customer ID")
    @DeleteMapping("deleteByCustomerId/{userId}")
    public ResponseEntity<String> deleteByCustomerId(@PathVariable("userId") int userId) {
        return cartService.deleteByCustomerId(userId);
    }

    @Operation(summary = "Add an item to the customer's cart")
    @PostMapping("/addItem/items/{itemId}")
    public ResponseEntity<Cart> addItem(
            @PathVariable int itemId,
            @RequestHeader("Authorization") String token) {
        return cartService.addItem(itemId, token);
    }

    @Operation(summary = "Remove an item from the cart")
    @DeleteMapping("/removeItem/items/{itemId}")
    public ResponseEntity<Void> removeItem(
            @PathVariable int itemId,
            @RequestHeader("Authorization") String token) {
        cartService.removeItem(token, itemId);
        return ResponseEntity.noContent().build();
    }

}