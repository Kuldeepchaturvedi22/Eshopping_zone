package com.orderservice.app.service;

import com.orderservice.app.dto.*;
import com.orderservice.app.entity.*;
import com.orderservice.app.exception.CartNotFoundException;
import com.orderservice.app.exception.OrderNotFoundException;
import com.orderservice.app.exception.OrderServiceException;
import com.orderservice.app.feign.CartClient;
import com.orderservice.app.feign.NotificationClient;
import com.orderservice.app.feign.UserClient;
import com.orderservice.app.repository.OrderRepository;
import com.orderservice.app.security.JwtUtil;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    private CartClient cartClient;

    @Autowired
    private UserClient userClient;

    @Autowired
    private NotificationClient notificationClient;

    @Autowired
    private NotificationDetails notificationDetails;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    @Transactional
    public Order placeOrder(String token) {
        String email = jwtUtil.extractEmail(token);
        User user = userClient.getUserByEmail(email);
        List<CartDTO> carts = cartClient.getByCustomerId(user.getUserId());

        if (carts == null || carts.isEmpty()) {
            throw new CartNotFoundException("Your Cart is Empty");
        }

        CartDTO cartDTO = carts.get(0);

        Order order = new Order();
        order.setCartId(cartDTO.getCartId()); // external reference
        order.setCustomerId(user.getUserId());
        order.setOrderDate(LocalDate.now());
        order.setOrderStatus(Status.PENDING);
        order.setAmountPaid(cartDTO.getTotalPrice());
        order.setModeOfPayment("PENDING");

        // Build and attach address
        AddressDto addressDto = userClient.getUserAddress(user.getUserId());
        Address address = new Address();
        address.setCity(addressDto.getCity());
        address.setCountry(addressDto.getCountry());
        address.setStreet(addressDto.getStreet());
        address.setState(addressDto.getState());
        address.setZipCode(addressDto.getZipCode());

        // Build payment shell
        Payment payment = new Payment();
        payment.setPaymentStatus("PENDING");
        payment.setAmount(cartDTO.getTotalPrice());
        payment.setPaymentMethod("PENDING");

        // Build a snapshot of cart and its items for persistence with the order
        Cart cartSnapshot = new Cart();
        cartSnapshot.setTotalPrice(cartDTO.getTotalPrice());

        // IMPORTANT: Use a mutable list for JPA-managed collections
        List<Items> itemEntities = new ArrayList<>();
        for (var i : cartDTO.getItems()) {
            Items item = new Items();
            item.setItemName(i.getItemName());
            item.setItemType(i.getItemType());
            item.setPrice(i.getPrice());
            item.setQuantity(i.getQuantity());
            item.setProductId(i.getProductId());
            item.setMerchantEmail(i.getMerchantEmail());
            item.setCart(cartSnapshot);
            itemEntities.add(item);
        }
        cartSnapshot.setItems(itemEntities);

        // Derive order-level merchant email (first item)
        if (!itemEntities.isEmpty()) {
            order.setMerchantEmail(itemEntities.get(0).getMerchantEmail());
        }

        // Wire associations
        order.setCart(cartSnapshot);

        address.setOrder(order);
        order.setAddress(address);

        payment.setOrder(order); // @MapsId will set payment.orderId = order.orderId
        order.setPayment(payment);

        // Persist order, cascading payment, address, cart, and items
        order = orderRepository.save(order);

        try {
            int amountInRupees = (int) (cartDTO.getTotalPrice());
            String paymentLink = String.format(
                    "http://localhost:8006/payment/create-order?amount=%d&orderId=%d",
                    amountInRupees, order.getOrderId()
            );

            sendOrderConfirmationEmail(email, order, cartDTO.getTotalPrice(), paymentLink);
            order.setPaymentLink(paymentLink);
            orderRepository.save(order);
            // This part I have changed recently
            cartClient.deleteByCustomerId(order.getCustomerId());

            return order;

        } catch (Exception e) {
            order.setOrderStatus(Status.FAILED);
            order.getPayment().setPaymentStatus("FAILED");
            orderRepository.save(order);
            throw new OrderServiceException("Failed to initiate payment: " + e.getMessage());
        }
    }

    @Transactional
    public Order updatePaymentStatus(PaymentDto request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID " + request.getOrderId()));

        order.setRazorpayOrderId(request.getRazorpayId());
        order.setRazorpayPaymentId(request.getPaymentId());

        Payment payment = order.getPayment();
        if (payment == null) {
            payment = new Payment();
            payment.setOrder(order); // @MapsId will link PKs
            order.setPayment(payment);
        }

        payment.setPaymentId(request.getPaymentId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(request.getPaymentStatus());

        switch (request.getPaymentStatus().toUpperCase()) {
            case "COMPLETED":
                order.setOrderStatus(Status.PLACED);
                order.setModeOfPayment(request.getPaymentMethod());
                order.setAmountPaid(request.getAmount());
                cartClient.deleteByCustomerId(order.getCustomerId());
                sendNotification(order, "Payment Successful",
                        "Your payment has been received and order is confirmed. Transaction ID: " + request.getPaymentId());
                break;

            case "FAILED":
                order.setOrderStatus(Status.FAILED);
                payment.setPaymentStatus("FAILED");
                sendNotification(order, "Payment Failed",
                        "Your payment was not successful. " + request.getTransactionDetails());
                break;

            case "PENDING":
                order.setOrderStatus(Status.PENDING);
                payment.setPaymentStatus("PENDING");
                break;

            default:
                throw new IllegalArgumentException("Invalid payment status: " + request.getPaymentStatus());
        }

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrdersByMerchantEmail(String email) {
        List<Order> orders = orderRepository.findByMerchantEmail(email);
        if (orders.isEmpty()) {
            throw new OrderNotFoundException("No Orders found for the merchant with email: " + email);
        }
        return orders;
    }

    private void sendOrderConfirmationEmail(String email, Order order, double totalAmount, String paymentLink) {
        notificationDetails.setRecipient(email);
        notificationDetails.setSubject("Order Placed Successfully - Payment Pending");
        String emailBody = String.format(
                "Your order #%d has been placed successfully!\n\n" +
                        "Order Details:\n" +
                        "Total Amount: ₹%.2f\n" +
                        "Status: Pending Payment\n\n" +
                        "To complete your order, please copy and paste this payment link in your browser:\n%s\n\n" +
                        "Note: Your order will be confirmed once the payment is completed.",
                order.getOrderId(),
                totalAmount,
                paymentLink
        );
        notificationDetails.setMsgBody(emailBody);
        notificationClient.sendEmail(notificationDetails);
    }

    private void sendNotification(Order order, String subject, String message) {
        User user = userClient.getUserById(order.getCustomerId());
        notificationDetails.setRecipient(user.getEmailId());
        notificationDetails.setSubject(subject);
        notificationDetails.setMsgBody(message);
        notificationClient.sendEmail(notificationDetails);
    }

    @Override
    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        if (orders.isEmpty()) {
            throw new OrderNotFoundException("No Orders found!!");
        }
        return orders;
    }

    @Override
    public List<OrderDTO> getOrderByCustomerId(int customerId) {
        List<Order> orderList = orderRepository.findByCustomerId(customerId);
        if (orderList.isEmpty()) {
            throw new OrderNotFoundException("You have not ordered yet!");
        }
        ModelMapper modelMapper = new ModelMapper();

        return orderList.stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .toList();

    }

    @Override
    public Order changeOrderStatus(Status orderStatus, int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID " + orderId));
        order.setOrderStatus(orderStatus);

        User user = userClient.getUserById(order.getCustomerId());
        notificationDetails.setRecipient(user.getEmailId());
        notificationDetails.setSubject("Order Status");
        notificationDetails.setMsgBody("Your Order Status is " + order.getOrderStatus());
        notificationClient.sendEmail(notificationDetails);

        return orderRepository.save(order);
    }

    @Override
    public String cancelOrder(int orderId) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isPresent()) {
            orderRepository.delete(order.get());
            return "Successfully Deleted";
        } else {
            throw new OrderNotFoundException("Order not found with ID " + orderId);
        }
    }

    @Override
    public List<Order> getLatestOrdersWithTime(LocalDateTime time) {
        // DB stores only LocalDate (yyyy-MM-dd), so convert and fetch that date's orders
        LocalDate targetDate = time.toLocalDate();
        return orderRepository.findByOrderDate(targetDate);
    }

    @Override
    public Optional<Order> getOrderById(int orderId) {
        return orderRepository.findById(orderId);
    }
}