package com.userservice.service;

import com.userservice.dto.AddressDTO;
import com.userservice.dto.CartDTO;
import com.userservice.dto.JwtRequest;
import com.userservice.dto.JwtResponse;
import com.userservice.entity.Address;
import com.userservice.entity.Role;
import com.userservice.entity.User;
import com.userservice.exception.UserNotFoundException;
import com.userservice.feign.CartClient;
import com.userservice.feign.OrderClient;
import com.userservice.repository.UserRepository;
import com.userservice.security.JwtTokenUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CartClient cartClient;

    @Mock
    private OrderClient orderClient;

    @Mock
    private MyUserDetailsService myUserDetailsService;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @Mock
    private com.userservice.feign.NotificationClient notificationClient;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId(1);
        testUser.setFullName("Test User");
        testUser.setEmailId("test@example.com");
        testUser.setMobileNumber(1234567890L);
        testUser.setPassword("password");
        testUser.setRole(Role.CUSTOMER);
        testUser.setDateOfBirth(new Date());
        testUser.setGender("Male");
    }

//    @Test
//    void createUser_Success() {
//        String expectedEmail = testUser.getEmailId();
//        String temporaryPassword = "100000";
//        when(userRepository.findByEmailId(expectedEmail)).thenReturn(null);
//        when(userRepository.save(any(User.class))).thenReturn(testUser);
//        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
//        when(notificationClient.sendRegistrationEmail(eq(expectedEmail), anyString()))
//                .thenReturn("Email sent successfully");
//
//        ResponseEntity<String> response = userService.createUser(testUser);
//
//        assertEquals(HttpStatus.CREATED, response.getStatusCode());
//        assertEquals("User Created With UserId " + testUser.getUserId() + " . Temporary password sent in your email.",
//                response.getBody());
//
//        verify(userRepository).findByEmailId(expectedEmail);
//        verify(notificationClient).sendRegistrationEmail(eq(expectedEmail), anyString());
//        verify(userRepository).save(argThat(savedUser ->
//                savedUser.getEmailId().equals(expectedEmail) &&
//                        savedUser.getPassword().equals("encodedPassword")
//        ));
//    }

//    @Test
//    void createUser_EmailSendingFails() {
//        when(userRepository.findByEmailId(anyString())).thenReturn(null);
//        when(notificationClient.sendRegistrationEmail(anyString(), anyString()))
//                .thenThrow(new RuntimeException("Email sending failed"));
//
//        ResponseEntity<String> response = userService.createUser(testUser);
//
//        assertEquals(HttpStatus.CREATED, response.getStatusCode());
//        assertEquals("Something wrong, email could not be sent.", response.getBody());
//        verify(userRepository, never()).save(any());
//    }
//
//    @Test
//    void createUser_UserExists() {
//        when(userRepository.findByEmailId(anyString())).thenReturn(testUser);
//
//        ResponseEntity<String> response = userService.createUser(testUser);
//
//        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
//        assertEquals("User already exists with this email id", response.getBody());
//        verify(userRepository, never()).save(any(User.class));
//    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        ResponseEntity<User> response = userService.getUserById(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testUser, response.getBody());
    }

    @Test
    void getUserById_UserNotFound() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getUserById(1));
    }

    @Test
    void updateUser_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User updatedUser = new User();
        updatedUser.setFullName("Updated Name");
        updatedUser.setEmailId("updated@example.com");

        ResponseEntity<String> response = userService.updateUser(1, updatedUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User updated successfully", response.getBody());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_UserNotFound() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        User updatedUser = new User();
        assertThrows(UserNotFoundException.class, () -> userService.updateUser(1, updatedUser));
    }

    @Test
    void login_Success() {
        JwtRequest request = new JwtRequest("test@example.com", "password");
        when(userRepository.findByEmailId(anyString())).thenReturn(testUser);
        when(authenticationManager.authenticate(any())).thenReturn(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        when(jwtTokenUtil.generateToken(any())).thenReturn("dummy-token");

        ResponseEntity<JwtResponse> response = userService.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("dummy-token", response.getBody().getJwtToken());
        assertEquals(Role.CUSTOMER.name(), response.getBody().getRole());
    }

    @Test
    void login_InvalidCredentials() {
        JwtRequest request = new JwtRequest("test@example.com", "wrongpassword");
        when(userRepository.findByEmailId(anyString())).thenReturn(testUser);
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Invalid Username or Password!"));

        assertThrows(BadCredentialsException.class, () -> userService.login(request));
    }

    @Test
    void getAllUsers_Success() {
        List<User> userList = Collections.singletonList(testUser);
        when(userRepository.findAll()).thenReturn(userList);

        ResponseEntity<List<User>> response = userService.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userList, response.getBody());
    }

    @Test
    void deleteUser_Success() {
        doNothing().when(userRepository).deleteById(1);

        ResponseEntity<String> response = userService.deleteUser(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User deleted successfully", response.getBody());
        verify(userRepository).deleteById(1);
    }

    @Test
    void updatePassword_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");

        ResponseEntity<String> response = userService.updatePassword(1, "newPassword");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password updated successfully", response.getBody());
        verify(userRepository).save(argThat(user ->
                user.getPassword().equals("encodedNewPassword")));
    }

    @Test
    void getCart_Success() {
        List<CartDTO> cartItems = List.of(new CartDTO());
        when(cartClient.getCartByCustomerId(1)).thenReturn(cartItems);

        ResponseEntity<List<CartDTO>> response = userService.getCart(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(cartItems, response.getBody());
    }

    @Test
    void getCart_Error() {
        when(cartClient.getCartByCustomerId(1)).thenThrow(new RuntimeException("Service unavailable"));

        assertThrows(RuntimeException.class, () -> userService.getCart(1));
    }

    @Test
    void getAddressByUserId_Success() {
        User user = testUser;
        Address address = new Address();
        address.setAddressId(1);
        address.setStreet("Test Street");
        user.setAddress(List.of(address));

        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        ResponseEntity<AddressDTO> response = userService.getAddressByUserId(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Test Street", response.getBody().getStreet());
    }

    @Test
    void getAddressByUserId_NoAddress() {
        User user = testUser;
        user.setAddress(Collections.emptyList());
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        assertThrows(UserNotFoundException.class, () ->
                userService.getAddressByUserId(1));
    }


    @Test
    void getOrders_UserNotFound() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () ->
                userService.getOrders(1));
    }

    @Test
    void getOrders_ServiceError() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(orderClient.getOrdersByCustomerId(1)).thenThrow(new RuntimeException("Service unavailable"));

        assertThrows(RuntimeException.class, () ->
                userService.getOrders(1));
    }

}