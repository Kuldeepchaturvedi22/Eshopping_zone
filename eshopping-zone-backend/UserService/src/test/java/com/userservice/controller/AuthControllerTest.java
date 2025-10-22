package com.userservice.controller;

import com.userservice.dto.JwtRequest;
import com.userservice.dto.JwtResponse;
import com.userservice.dto.PasswordDTO;
import com.userservice.entity.Role;
import com.userservice.entity.User;
import com.userservice.security.JwtTokenUtil;
import com.userservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class AuthControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    private JwtRequest loginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        loginRequest = new JwtRequest("test@example.com", "password");
        testUser = new User();
        testUser.setEmailId("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setRole(Role.CUSTOMER);
    }

    @Test
    void login_Success() {
        JwtResponse expectedResponse = new JwtResponse();
        expectedResponse.setJwtToken("dummy-token");
        expectedResponse.setRole(Role.CUSTOMER.name());

        when(userService.login(any(JwtRequest.class)))
                .thenReturn(new ResponseEntity<>(expectedResponse, HttpStatus.OK));

        ResponseEntity<JwtResponse> response = authController.login(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("dummy-token", response.getBody().getJwtToken());
        assertEquals(Role.CUSTOMER.name(), response.getBody().getRole());
    }

    @Test
    void login_InvalidCredentials() {
        when(userService.login(any(JwtRequest.class)))
                .thenThrow(new BadCredentialsException("Invalid Username or Password!"));

        assertThrows(BadCredentialsException.class, () ->
                authController.login(loginRequest));
    }
//    @Test
//    void createUser_Success() {
//        when(userService.createUser(any(User.class)))
//                .thenReturn(new ResponseEntity<>("User Created Successfully", HttpStatus.CREATED));
//
//        ResponseEntity<String> response = authController.createUser(testUser);
//
//        assertEquals(HttpStatus.CREATED, response.getStatusCode());
//        assertEquals("User Created Successfully", response.getBody());
//        verify(userService).createUser(testUser);
//    }
//
//    @Test
//    void createUser_BadRequest() {
//        when(userService.createUser(any(User.class)))
//                .thenReturn(new ResponseEntity<>("User already exists", HttpStatus.BAD_REQUEST));
//
//        ResponseEntity<String> response = authController.createUser(testUser);
//
//        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
//        assertEquals("User already exists", response.getBody());
//    }

    @Test
    void updatePassword_Success() {
        String userId = "1";
        PasswordDTO passwordDTO = new PasswordDTO();
        passwordDTO.setPassword("newPassword");

        when(userService.updatePassword(eq(1), eq("newPassword")))
                .thenReturn(new ResponseEntity<>("Password updated successfully", HttpStatus.OK));

        ResponseEntity<String> response = authController.updatePassword(userId, passwordDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password updated successfully", response.getBody());
        verify(userService).updatePassword(1, "newPassword");
    }

    @Test
    void updatePassword_UserNotFound() {
        String userId = "1";
        PasswordDTO passwordDTO = new PasswordDTO();
        passwordDTO.setPassword("newPassword");

        when(userService.updatePassword(eq(1), anyString()))
                .thenReturn(new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND));

        ResponseEntity<String> response = authController.updatePassword(userId, passwordDTO);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }
}