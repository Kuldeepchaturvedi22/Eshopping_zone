package com.cartservice.app.controller;

import com.cartservice.app.dto.CartDTO;
import com.cartservice.app.entity.Cart;
import com.cartservice.app.entity.Items;
import com.cartservice.app.service.CartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CartControllerTest {

    @Mock
    private CartService cartService;

    @InjectMocks
    private CartController cartController;

    @BeforeEach
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetByCustomerId() {
        int customerId = 1;
        CartDTO cartDTO = new CartDTO();
        List<CartDTO> expectedCarts = Collections.singletonList(cartDTO);
        when(cartService.getByCustomerId(customerId)).thenReturn(expectedCarts);

        List<CartDTO> result = cartController.getByCustomerId(customerId);

        assertEquals(expectedCarts, result);
        verify(cartService).getByCustomerId(customerId);
    }

    @Test
    public void testGetCart() {
        int cartId = 1;
        Cart mockCart = new Cart();
        when(cartService.getcartById(cartId)).thenReturn(ResponseEntity.ok(mockCart));

        ResponseEntity<Cart> response = cartController.getCart(cartId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockCart, response.getBody());
        verify(cartService).getcartById(cartId);
    }

    @Test
    public void testUpdateCart() {
        int cartId = 1;
        Cart cart = new Cart();
        when(cartService.updateCart(cartId, cart)).thenReturn(ResponseEntity.ok(cart));

        ResponseEntity<Cart> response = cartController.updateCart(cartId, cart);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(cart, response.getBody());
        verify(cartService).updateCart(cartId, cart);
    }

    @Test
    public void testGetAllCarts() {
        List<Cart> mockCarts = Arrays.asList(new Cart(), new Cart());
        when(cartService.getallcarts()).thenReturn(ResponseEntity.ok(mockCarts));

        ResponseEntity<List<Cart>> response = cartController.getAllCarts();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockCarts, response.getBody());
        verify(cartService).getallcarts();
    }

    @Test
    public void testDeleteCart() {
        int cartId = 1;
        String successMessage = "Cart deleted successfully";
        when(cartService.deleteCart(cartId)).thenReturn(ResponseEntity.ok(successMessage));

        ResponseEntity<String> response = cartController.deleteCart(cartId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(successMessage, response.getBody());
        verify(cartService).deleteCart(cartId);
    }

    @Test
    public void testDeleteByCustomerId() {
        int userId = 1;
        String successMessage = "Cart deleted successfully";
        when(cartService.deleteByCustomerId(userId)).thenReturn(ResponseEntity.ok(successMessage));

        ResponseEntity<String> response = cartController.deleteByCustomerId(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(successMessage, response.getBody());
        verify(cartService).deleteByCustomerId(userId);
    }

    @Test
    public void testAddItem() {
        int itemId = 1;
        String token = "Bearer token";
        Cart cart = new Cart();
        when(cartService.addItem(itemId, token)).thenReturn(ResponseEntity.ok(cart));

        ResponseEntity<Cart> response = cartController.addItem(itemId, token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(cart, response.getBody());
        verify(cartService).addItem(itemId, token);
    }

    @Test
    public void testRemoveItem() {
        int itemId = 1;
        String token = "Bearer token";
        doNothing().when(cartService).removeItem(token, itemId);

        ResponseEntity<Void> response = cartController.removeItem(itemId, token);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(cartService).removeItem(token, itemId);
    }
}