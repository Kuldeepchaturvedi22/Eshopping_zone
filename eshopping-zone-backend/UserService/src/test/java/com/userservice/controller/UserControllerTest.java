package com.userservice.controller;

import com.userservice.dto.AddressDTO;
import com.userservice.dto.CartDTO;
import com.userservice.dto.OrderDTO;
import com.userservice.entity.Role;
import com.userservice.entity.User;
import com.userservice.exception.UserNotFoundException;
import com.userservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId(1);
        testUser.setFullName("Test User");
        testUser.setEmailId("test@example.com");
        testUser.setRole(Role.CUSTOMER);
    }

//    @Test
//    void createUser_Success() {
//        when(userService.createUser(any(User.class)))
//                .thenReturn(new ResponseEntity<>("User Created", HttpStatus.CREATED));
//
//        ResponseEntity<String> response = userController.createUser(testUser);
//
//        assertEquals(HttpStatus.CREATED, response.getStatusCode());
//        assertEquals("User Created", response.getBody());
//    }

    @Test
    void getUserById_Success() {
        when(userService.getUserById(anyInt()))
                .thenReturn(new ResponseEntity<>(testUser, HttpStatus.OK));

        ResponseEntity<User> response = userController.getUserById(String.valueOf(1));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testUser, response.getBody());
    }

    @Test
    void getAllUsers_Success() {
        List<User> users = Arrays.asList(testUser);
        when(userService.getAllUsers())
                .thenReturn(new ResponseEntity<>(users, HttpStatus.OK));

        ResponseEntity<List<User>> response = userController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(testUser, response.getBody().get(0));
    }

    @Test
    void getCartsByCustomerId_Success() {
        List<CartDTO> carts = Arrays.asList(new CartDTO());
        when(userService.getCart(anyInt()))
                .thenReturn(new ResponseEntity<>(carts, HttpStatus.OK));

        ResponseEntity<List<CartDTO>> response = userController.getCartsByCustomerId(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getOrdersByCustomerId_Success() {
        List<OrderDTO> orders = Arrays.asList(new OrderDTO());
        when(userService.getOrders(anyInt()))
                .thenReturn(new ResponseEntity<>(orders, HttpStatus.OK));

        ResponseEntity<List<OrderDTO>> response = userController.getOrdersByCustomerId(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }
    @Test
    void updateUser_Success() {
        User updatedUser = new User();
        updatedUser.setFullName("Updated Name");
        updatedUser.setEmailId("updated@example.com");

        when(userService.updateUser(anyInt(), any(User.class)))
                .thenReturn(new ResponseEntity<>("User updated successfully", HttpStatus.OK));

        ResponseEntity<String> response = userController.updateUser(1, updatedUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User updated successfully", response.getBody());
        verify(userService).updateUser(1, updatedUser);
    }

    @Test
    void updateUser_NotFound() {
        User updatedUser = new User();
        when(userService.updateUser(anyInt(), any(User.class)))
                .thenThrow(new UserNotFoundException("User not found"));

        assertThrows(UserNotFoundException.class, () ->
                userController.updateUser(1, updatedUser));
    }

    @Test
    void deleteUser_Success() {
        when(userService.deleteUser(anyInt()))
                .thenReturn(new ResponseEntity<>("User deleted successfully", HttpStatus.OK));

        ResponseEntity<String> response = userController.deleteUser(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User deleted successfully", response.getBody());
        verify(userService).deleteUser(1);
    }

    @Test
    void deleteUser_NotFound() {
        when(userService.deleteUser(anyInt()))
                .thenThrow(new UserNotFoundException("User not found"));

        assertThrows(UserNotFoundException.class, () ->
                userController.deleteUser(1));
    }

    @Test
    void getAddress_Success() {
        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setStreet("Test Street");
        addressDTO.setCity("Test City");

        when(userService.getAddressByUserId(anyInt()))
                .thenReturn(new ResponseEntity<>(addressDTO, HttpStatus.OK));

        ResponseEntity<AddressDTO> response = userController.getAddress(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Test Street", response.getBody().getStreet());
        verify(userService).getAddressByUserId(1);
    }

    @Test
    void getAddress_NotFound() {
        when(userService.getAddressByUserId(anyInt()))
                .thenThrow(new UserNotFoundException("Address not found"));

        assertThrows(UserNotFoundException.class, () ->
                userController.getAddress(1));
    }
}