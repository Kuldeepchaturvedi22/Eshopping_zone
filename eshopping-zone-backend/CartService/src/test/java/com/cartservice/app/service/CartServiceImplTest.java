package com.cartservice.app.service;

import com.cartservice.app.dto.CartDTO;
import com.cartservice.app.entity.Cart;
import com.cartservice.app.entity.Items;
import com.cartservice.app.entity.Product;
import com.cartservice.app.entity.User;
import com.cartservice.app.exception.CartServiceException;
import com.cartservice.app.feign.ProductClient;
import com.cartservice.app.feign.UserClient;
import com.cartservice.app.mapper.CartMapper;
import com.cartservice.app.repository.CartRepository;
import com.cartservice.app.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private ProductClient productClient;
    @Mock
    private UserClient userClient;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private CartMapper cartMapper;

    @InjectMocks
    private CartServiceImpl cartService;

    private Cart testCart;
    private List<Cart> testCarts;

    @BeforeEach
    void setup() {
        testCart = new Cart();
        testCart.setCartId(1);
        testCart.setCustomerId(123);
        testCart.setTotalPrice(0);

        Items item1 = new Items();
        item1.setItemId(1);
        item1.setProductId(101);
        item1.setPrice(50.0);
        item1.setQuantity(2);

        Items item2 = new Items();
        item2.setItemId(2);
        item2.setProductId(102);
        item2.setPrice(75.0);
        item2.setQuantity(1);

        List<Items> items = new ArrayList<>();
        items.add(item1);
        items.add(item2);

        testCart.setItems(items);

        testCarts = new ArrayList<>();
        testCarts.add(testCart);
    }

    @Test
    void testGetCartById_ExistingId_ReturnsCart() {
        when(cartRepository.findById(1)).thenReturn(Optional.of(testCart));
        ResponseEntity<Cart> response = cartService.getcartById(1);
        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(123, response.getBody().getCustomerId());
    }

    @Test
    void testGetCartById_NonExistingId_ThrowsException() {
        when(cartRepository.findById(999)).thenReturn(Optional.empty());
        CartServiceException exception = assertThrows(CartServiceException.class, () -> cartService.getcartById(999));
        assertEquals("Cart not found with ID 999", exception.getMessage());
    }

    @Test
    void testUpdateCart_NonExistingId_ThrowsException() {
        when(cartRepository.findById(999)).thenReturn(Optional.empty());
        CartServiceException exception = assertThrows(CartServiceException.class, () -> cartService.updateCart(999, testCart));
        assertEquals("Cart Id not present", exception.getMessage());
    }

    @Test
    void testGetAllCarts_ReturnsListOfCarts() {
        when(cartRepository.findAll()).thenReturn(testCarts);
        ResponseEntity<List<Cart>> response = cartService.getallcarts();
        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testGetAllCarts_EmptyList_ThrowsException() {
        when(cartRepository.findAll()).thenReturn(new ArrayList<>());
        CartServiceException exception = assertThrows(CartServiceException.class, () -> cartService.getallcarts());
        assertEquals("No any data present", exception.getMessage());
    }

    @Test
    void testAddCart_ValidCart_ReturnsSavedCart() {
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);
        for (Items item : testCart.getItems()) {
            Product product = new Product();
            product.setProductId(item.getProductId());
            product.setPrice(item.getPrice());
            when(productClient.getProductById(item.getProductId())).thenReturn(product);
        }
        ResponseEntity<Cart> response = cartService.addCart(testCart);
        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testDeleteCart_NonExistingId_ThrowsException() {
        when(cartRepository.findById(999)).thenReturn(Optional.empty());
        CartServiceException exception = assertThrows(CartServiceException.class, () -> cartService.deleteCart(999));
        assertEquals("Cart Id not present", exception.getMessage());
    }

    @Test
    void testGetOrCreateCart_CreatesNewCartIfNotExists() {
        String token = "token";
        String email = "user@example.com";
        User user = new User();
        user.setUserId(123);

        when(jwtUtil.extractEmail(token)).thenReturn(email);
        when(userClient.getUserByEmail(email)).thenReturn(user);
        when(cartRepository.findByCustomerId(123)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        ResponseEntity<Cart> response = cartService.getOrCreateCart(token);
        assertNotNull(response.getBody());
        assertEquals(123, response.getBody().getCustomerId());
    }

    @Test
    void testGetOrCreateCart_ReturnsExistingCart() {
        String token = "token";
        String email = "user@example.com";
        User user = new User();
        user.setUserId(123);

        when(jwtUtil.extractEmail(token)).thenReturn(email);
        when(userClient.getUserByEmail(email)).thenReturn(user);
        when(cartRepository.findByCustomerId(123)).thenReturn(Optional.of(testCart));

        ResponseEntity<Cart> response = cartService.getOrCreateCart(token);
        assertNotNull(response.getBody());
        assertEquals(123, response.getBody().getCustomerId());
    }

    @Test
    void testDeleteByCustomerId_ExistingCustomerId_DeletesCart() {
        when(cartRepository.findByCustomerId(123)).thenReturn(Optional.of(testCart));

        ResponseEntity<String> response = cartService.deleteByCustomerId(123);

        verify(cartRepository, times(1)).deleteById(123);
        assertEquals("Items deleted successfully", response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testDeleteByCustomerId_NonExistingCustomerId_ThrowsException() {
        when(cartRepository.findByCustomerId(999)).thenReturn(Optional.empty());

        CartServiceException exception = assertThrows(CartServiceException.class, () -> cartService.deleteByCustomerId(999));
        assertEquals("Cart Id not present", exception.getMessage());
    }

    @Test
    void testGetByCustomerId_ExistingCustomerId_ReturnsCartDTO() {
        when(cartRepository.findByCustomerId(123)).thenReturn(Optional.of(testCart));
        CartDTO cartDTO = new CartDTO();
        when(cartMapper.toDTO(testCart)).thenReturn(cartDTO);

        List<CartDTO> response = cartService.getByCustomerId(123);

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals(cartDTO, response.get(0));
    }

    @Test
    void testGetByCustomerId_NonExistingCustomerId_ThrowsException() {
        when(cartRepository.findByCustomerId(999)).thenReturn(Optional.empty());

        CartServiceException exception = assertThrows(CartServiceException.class, () -> cartService.getByCustomerId(999));
        assertEquals("Cart not found for customer ID 999", exception.getMessage());
    }

    @Test
    void testRemoveItem_ExistingItem_RemovesItem() {
        String token = "token";
        String email = "user@example.com";
        User user = new User();
        user.setUserId(123);

        when(jwtUtil.extractEmail(token)).thenReturn(email);
        when(userClient.getUserByEmail(email)).thenReturn(user);
        when(cartRepository.findByCustomerId(123)).thenReturn(Optional.of(testCart));

        cartService.removeItem(token, 1);

        verify(cartRepository, times(1)).save(testCart);
        assertEquals(1, testCart.getItems().size());
    }

    @Test
    void testRemoveItem_NonExistingItem_ThrowsException() {
        String token = "token";
        String email = "user@example.com";
        User user = new User();
        user.setUserId(123);

        when(jwtUtil.extractEmail(token)).thenReturn(email);
        when(userClient.getUserByEmail(email)).thenReturn(user);
        when(cartRepository.findByCustomerId(123)).thenReturn(Optional.of(testCart));

        CartServiceException exception = assertThrows(CartServiceException.class, () -> cartService.removeItem(token, 999));
        assertEquals("Item not found with ID 999", exception.getMessage());
    }

    @Test
    void testAddItem_NewItem_AddsToCart() {
        String token = "token";
        String email = "user@example.com";
        int customerId = 123;
        int itemId = 101;

        User user = new User();
        user.setUserId(customerId);

        Cart cart = new Cart();
        cart.setCustomerId(customerId);
        cart.setItems(new ArrayList<>());

        Product product = new Product();
        product.setProductId(itemId);
        product.setProductName("Test Product");
        product.setProductType("Type");
        product.setCategory("Cat");
        product.setImage("img");
        product.setPrice(100.0);
        product.setDescription("desc");
        product.setDiscount(10.0);

        when(jwtUtil.extractEmail(token)).thenReturn(email);
        when(userClient.getUserByEmail(email)).thenReturn(user);
        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(productClient.getProductById(itemId)).thenReturn(product);
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        ResponseEntity<Cart> response = cartService.addItem(itemId, token);

        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getItems().size());
        assertEquals("Test Product", response.getBody().getItems().get(0).getItemName());
    }

    @Test
    void testAddItem_ExistingItem_IncrementsQuantity() {
        String token = "token";
        String email = "user@example.com";
        int customerId = 123;
        int itemId = 101;

        User user = new User();
        user.setUserId(customerId);

        Items item = new Items();
        item.setProductId(itemId);
        item.setQuantity(1);

        Cart cart = new Cart();
        cart.setCustomerId(customerId);
        cart.setItems(new ArrayList<>(List.of(item)));

        Product product = new Product();
        product.setProductId(itemId);

        when(jwtUtil.extractEmail(token)).thenReturn(email);
        when(userClient.getUserByEmail(email)).thenReturn(user);
        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(productClient.getProductById(itemId)).thenReturn(product);
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        ResponseEntity<Cart> response = cartService.addItem(itemId, token);

        assertEquals(2, response.getBody().getItems().get(0).getQuantity());
    }

    @Test
    void testAddItem_ProductNotFound_ThrowsException() {
        String token = "token";
        String email = "user@example.com";
        int customerId = 123;
        int itemId = 101;

        User user = new User();
        user.setUserId(customerId);

        Cart cart = new Cart();
        cart.setCustomerId(customerId);
        cart.setItems(new ArrayList<>());

        when(jwtUtil.extractEmail(token)).thenReturn(email);
        when(userClient.getUserByEmail(email)).thenReturn(user);
        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(productClient.getProductById(itemId)).thenReturn(null);

        CartServiceException exception = assertThrows(CartServiceException.class, () -> cartService.addItem(itemId, token));
        assertEquals("Product not found with ID: " + itemId, exception.getMessage());
    }
}