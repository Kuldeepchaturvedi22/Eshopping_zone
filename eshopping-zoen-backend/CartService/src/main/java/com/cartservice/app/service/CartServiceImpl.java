package com.cartservice.app.service;

import com.cartservice.app.dto.CartDTO;
import com.cartservice.app.dto.ItemDTO;
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
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductClient productClient;

    @Autowired
    private UserClient userClient;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CartMapper cartMapper;

    @Override
    public ResponseEntity<Cart> getOrCreateCart(String token) {
        String email = jwtUtil.extractEmail(token);
        User user = userClient.getUserByEmail(email);
        int customerId = user.getUserId();

        Optional<Cart> existingCart = cartRepository.findByCustomerId(customerId);
        if (existingCart.isPresent()) {
            return ResponseEntity.ok(existingCart.get());
        }

        Cart newCart = new Cart();
        newCart.setCustomerId(customerId);
        newCart.setItems(new ArrayList<>());
        newCart.setTotalPrice(0.0);

        return ResponseEntity.ok(cartRepository.save(newCart));
    }

    @Override
    public ResponseEntity<Cart> addItem(int itemId, String token) {
        String email = jwtUtil.extractEmail(token);
        User user = userClient.getUserByEmail(email);
        int customerId = user.getUserId();

        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> getOrCreateCart(token).getBody());

        Product product = productClient.getProductById(itemId);
        if (product == null) {
            throw new CartServiceException("Product not found with ID: " + itemId);
        }

        // Check if an item already exists in the cart
        Optional<Items> existingItem = cart.getItems().stream()
                .filter(i -> i.getProductId() == itemId)
                .findFirst();

        if (existingItem.isPresent()) {
            Items it = existingItem.get();
            it.setQuantity(it.getQuantity() + 1);
            // Ensure merchant email is set if missing
            if (it.getMerchantEmail() == null) {
                it.setMerchantEmail(product.getMerchantEmail());
            }
        } else {
            Items item = new Items();
            item.setItemName(product.getProductName());
            item.setItemType(product.getProductType());
            item.setCategory(product.getCategory());
            item.setImage(product.getImage());
            item.setPrice(product.getPrice());
            item.setDescription(product.getDescription());
            item.setDiscount(product.getDiscount());
            item.setQuantity(1);
            item.setProductId(product.getProductId());
            item.setMerchantEmail(product.getMerchantEmail()); // IMPORTANT: populate merchant email
            item.setCart(cart);

            cart.getItems().add(item);
        }

        cart.setTotalPrice(cartTotal(cart));
        return ResponseEntity.ok(cartRepository.save(cart));
    }

    @Override
    public void removeItem(String token, int itemId) {
        String email = jwtUtil.extractEmail(token);
        User user = userClient.getUserByEmail(email);
        int customerId = user.getUserId();

        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new CartServiceException("Cart not found for customer ID " + customerId));

        boolean removed = cart.getItems().removeIf(item -> item.getItemId() == itemId);
        if (!removed) {
            throw new CartServiceException("Item not found with ID " + itemId);
        }

        cart.setTotalPrice(cartTotal(cart));
        cartRepository.save(cart);
    }

    private double cartTotal(Cart cart) {
        return cart.getItems().stream()
                .mapToDouble(item -> {
                    double discountedPrice = item.getPrice() * (1 - item.getDiscount() * 0.01);
                    return discountedPrice * item.getQuantity();
                })
                .sum();
    }

    @Override
    public ResponseEntity<Cart> getcartById(int cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartServiceException("Cart not found with ID " + cartId));

        return ResponseEntity.ok(cart);
    }

    @Override
    public ResponseEntity<Cart> updateCart(int cartId, @Valid Cart cart) {
        Optional<Cart> existingCart = cartRepository.findById(cartId);
        if (existingCart.isEmpty()) {
            throw new CartServiceException("Cart Id not present");
        }

        // Set the cart reference for each item and refresh price/merchantEmail from product service
        cart.getItems().forEach(item -> {
            item.setCart(cart); // Set the bidirectional relationship
            Product product = productClient.getProductById(item.getProductId());
            if (product != null) {
                item.setPrice(product.getPrice());
                item.setMerchantEmail(product.getMerchantEmail()); // ensure merchant email present
            }
        });

        cart.setCartId(cartId);
        cart.setTotalPrice(cartTotal(cart));
        return new ResponseEntity<>(cartRepository.save(cart), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<Cart>> getallcarts() {
        if (cartRepository.findAll().isEmpty()) {
            throw new CartServiceException("No any data present");
        }
        return new ResponseEntity<>(cartRepository.findAll(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Cart> addCart(@Valid Cart cart) {
        cart.getItems().forEach(item -> {
            Product product = productClient.getProductById(item.getProductId());
            if (product != null) {
                item.setPrice(product.getPrice());
                item.setMerchantEmail(product.getMerchantEmail()); // ensure merchant email present
            }
        });
        cart.setTotalPrice(cartTotal(cart));
        return new ResponseEntity<>(cartRepository.save(cart), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> deleteCart(int cartId) {
        Optional<Cart> c = cartRepository.findById(cartId);
        if (c.isEmpty()) {
            throw new CartServiceException("Cart Id not present");
        }
        cartRepository.deleteById(cartId);
        return new ResponseEntity<>("Items deleted successfully", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> deleteByCustomerId(int userId){
        Optional<Cart> c = cartRepository.findByCustomerId(userId);
        if (c.isEmpty()) {
            throw new CartServiceException("Cart Id not present");
        }
        cartRepository.deleteById(userId);
        return new ResponseEntity<>("Items deleted successfully", HttpStatus.OK);
    }

    @Override
    public List<CartDTO> getByCustomerId(int customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new CartServiceException("Cart not found for customer ID " + customerId));

        // Build DTO manually to guarantee merchantEmail is included
        CartDTO dto = new CartDTO();
        dto.setCartId(cart.getCartId());
        dto.setCustomerId(customerId);
        dto.setTotalPrice(cart.getTotalPrice());

        List<ItemDTO> itemDTOs = new ArrayList<>();
        for (Items item : cart.getItems()) {
            ItemDTO i = new ItemDTO();
            i.setItemId(item.getItemId());
            i.setItemType(item.getItemType());
            i.setItemName(item.getItemName());
            i.setCategory(item.getCategory());
            i.setImage(item.getImage());
            i.setPrice(item.getPrice());
            i.setDescription(item.getDescription());
            i.setDiscount(item.getDiscount());
            i.setQuantity(item.getQuantity());
            i.setProductId(item.getProductId());
            i.setMerchantEmail(item.getMerchantEmail()); // IMPORTANT: include merchant email
            itemDTOs.add(i);
        }
        dto.setItems(itemDTOs);

        return Collections.singletonList(dto);
    }

}