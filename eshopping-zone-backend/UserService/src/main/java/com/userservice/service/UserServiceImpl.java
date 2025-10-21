package com.userservice.service;

import com.userservice.dto.*;
import com.userservice.entity.Address;
import com.userservice.entity.User;
import com.userservice.exception.UserNotFoundException;
import com.userservice.feign.CartClient;
import com.userservice.feign.NotificationClient;
import com.userservice.feign.OrderClient;
import com.userservice.repository.UserRepository;
import com.userservice.security.JwtTokenUtil;
import com.userservice.security.UserTokenDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private NotificationClient notificationClient;

    @Autowired
    private OrderClient orderClient;

    @Autowired
    private CartClient cartClient;

    @Override
    public ResponseEntity<String> createUser(User user) {

        String token = String.valueOf(100000 + new Random().nextInt(900000));
        user.setPassword(passwordEncoder.encode(token));
        System.out.println(token);

        if (userRepository.findByEmailId(user.getEmailId()) != null) {
            return new ResponseEntity<>("User already exists with this email id", HttpStatus.BAD_REQUEST);
        }

        try {
            String emailResponse = notificationClient.sendRegistrationEmail(user.getEmailId(), token);
            System.out.println("Email sent response: " + emailResponse);
            userRepository.save(user);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            return new ResponseEntity<>("Something wrong, email could not be sent.", HttpStatus.CREATED);
        }

        return new ResponseEntity<>("User Created With UserId " + user.getUserId() + " . Temporary password sent in your email.", HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<String> forgetPassword(String emailId) {
        User user = userRepository.findByEmailId(emailId);
        if (user == null) {
            return new ResponseEntity<>("User not found with this email id", HttpStatus.BAD_REQUEST);
        }
        String token = String.valueOf(100000 + new Random().nextInt(900000));
        user.setPassword(passwordEncoder.encode(token));
        System.out.println(token);
        try {
            String emailResponse = notificationClient.sendRegistrationEmail(user.getEmailId(), token);
            System.out.println("Email sent response: " + emailResponse);
            userRepository.save(user);
        }catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            return new ResponseEntity<>("Something wrong, email could not be sent.", HttpStatus.CREATED);
        }
        return new ResponseEntity<>("Password sent to your email.", HttpStatus.OK);
    }

//    @Override
//    public ResponseEntity<String> createUser(User user, MultipartFile image) {
//
//        String token = String.valueOf(100000 + new Random().nextInt(900000));
//        user.setPassword(passwordEncoder.encode(token));
//        System.out.println(token);
//
//        if (userRepository.findByEmailId(user.getEmailId()) != null) {
//            return new ResponseEntity<>("User already exists with this email id", HttpStatus.BAD_REQUEST);
//        }
//
//        try {
//            if (image != null && !image.isEmpty()) {
//                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
//                Path uploadPath = Paths.get("uploads");
//                Files.createDirectories(uploadPath);
//                Files.copy(image.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
//                user.setImage(fileName);
//            }
//
//            String emailResponse = notificationClient.sendRegistrationEmail(user.getEmailId(), token);
//            System.out.println("Email sent response: " + emailResponse);
//
//            userRepository.save(user);
//
//        } catch (IOException e) {
//            return new ResponseEntity<>("Failed to store image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        } catch (Exception e) {
//            System.err.println("Failed to send email: " + e.getMessage());
//            return new ResponseEntity<>("Something wrong, email could not be sent.", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//
//        return new ResponseEntity<>("User Created With UserId " + user.getUserId() +
//                " . Temporary password sent in your email.", HttpStatus.CREATED);
//    }


    @Override
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> deleteUser(int userId) {
        userRepository.deleteById(userId);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> updateUser(int userId, User user) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }
        User updatedUser = existingUser.get();
        updatedUser.setFullName(user.getFullName());
        updatedUser.setEmailId(user.getEmailId());
        updatedUser.setMobileNumber(user.getMobileNumber());
        updatedUser.setAbout(user.getAbout());
        updatedUser.setDateOfBirth(user.getDateOfBirth());
        userRepository.save(updatedUser);
        return new ResponseEntity<>("User updated successfully", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> updatePassword(int userId, String newPassword) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }
        User updatedUser = existingUser.get();
        String newEncodedPassword = passwordEncoder.encode(newPassword);
        updatedUser.setPassword(newEncodedPassword); // Encode the new password
        System.out.println("given password" + newPassword);
        System.out.println("encoded password" + newEncodedPassword);
        userRepository.save(updatedUser);

        return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<CartDTO>> getCart(int customerId) {
        try {
            List<CartDTO> cartResponse = cartClient.getCartByCustomerId(customerId);
            return ResponseEntity.ok(cartResponse != null ? cartResponse : Collections.emptyList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching cart data: " + e.getMessage(), e);
        }
    }

    @Override
    public ResponseEntity<List<OrderDTO>> getOrders(int customerId) {
        if (userRepository.findById(customerId).isEmpty()) {
            throw new UserNotFoundException("User does not exist");
        }
        List<OrderDTO> orders;
        try {
            orders = orderClient.getOrdersByCustomerId(customerId);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching orders data: " + e.getMessage(), e);
        }
        System.out.println(orders.size() + " orders fetched for customer with ID: " + customerId + " ." + orders);

        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<AddressDTO> getAddressByUserId(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        List<Address> addresses = user.getAddress();

        if (addresses == null || addresses.isEmpty()) {
            throw new UserNotFoundException("Address not found for user with ID: " + userId);
        }
        Address address = addresses.get(0);

        // Map Address entity to AddressDTO
        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setAddressId(address.getAddressId());
        addressDTO.setStreet(address.getStreet());
        addressDTO.setCity(address.getCity());
        addressDTO.setState(address.getState());
        addressDTO.setCountry(address.getCountry());
        addressDTO.setZipCode(address.getZipCode());

        return new ResponseEntity<>(addressDTO, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<User> getUserById(int userId) {
        Optional<User> optional = userRepository.findById(userId);
        if (optional.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }
        return new ResponseEntity<>(optional.get(), HttpStatus.OK);
    }

    @Override
    public User getUserByEmailId(@PathVariable String email) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("🔐 Authenticated user: " + authentication.getName()); // Should not be anonymousUser
        return userRepository.findByEmailId(email);
    }


    @Override
    public ResponseEntity<JwtResponse> login(JwtRequest request) {
        this.doAuthenticate(request.getEmail(), request.getPassword());

        User user = userRepository.findByEmailId(request.getEmail());
        String token = this.jwtTokenUtil.generateToken(new UserTokenDetails(user));

        JwtResponse response = new JwtResponse();
        response.setJwtToken(token);
        response.setRole(user.getRole().name());

        System.out.println("Token: " + token);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private void doAuthenticate(String email, String password) {
        System.out.println("Authenticating user: " + email);
        User user = userRepository.findByEmailId(email);
        System.out.println("Entered password (raw): " + password);
        System.out.println("Password in DB (encoded): " + user.getPassword());
        System.out.println("Password matches? " + passwordEncoder.matches(password, user.getPassword()));

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, password);
        try {
            manager.authenticate(authentication);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid Username or Password!");
        }
    }

}
