package com.orderservice.app.service;

import com.orderservice.app.dto.AddressDto;
import com.orderservice.app.dto.CartDTO;
import com.orderservice.app.dto.OrderDTO;
import com.orderservice.app.dto.PaymentDto;
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
        List<CartDTO> cart = cartClient.getByCustomerId(user.getUserId());

        if (cart == null || cart.isEmpty()) {
            throw new CartNotFoundException("Your Cart is Empty");
        }

        Order order = new Order();
        order.setCartId(cart.get(0).getCartId());
        order.setCustomerId(user.getUserId());
        order.setOrderDate(LocalDate.now());
        order.setOrderStatus(Status.PENDING);
        order.setAmountPaid(cart.get(0).getTotalPrice());
        order.setModeOfPayment("PENDING");

        AddressDto addressDto = userClient.getUserAddress(user.getUserId());
        Address address = new Address();
        address.setCity(addressDto.getCity());
        address.setCountry(addressDto.getCountry());
        address.setStreet(addressDto.getStreet());
        address.setState(addressDto.getState());
        address.setZipCode(addressDto.getZipCode());

        Payment payment = new Payment();
        payment.setPaymentStatus("PENDING");
        payment.setAmount(cart.get(0).getTotalPrice());
        payment.setPaymentMethod("PENDING");

        order = orderRepository.save(order);

        address.setOrder(order);
        order.setAddress(address);

        payment.setOrderId(order.getOrderId());
        payment.setOrder(order);
        order.setPayment(payment);

        order = orderRepository.save(order);


        try {
            int amountInPaise = (int) (cart.get(0).getTotalPrice());
            String paymentLink = String.format("http://localhost:8006/payment/create-order?amount=%d&orderId=%d",
                    amountInPaise,
                    order.getOrderId());

            sendOrderConfirmationEmail(email, order, cart.get(0).getTotalPrice(), paymentLink);
            System.out.println("Payment Link: " + paymentLink);
            order.setPaymentLink(paymentLink);
            orderRepository.save(order);

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
            payment.setOrder(order);
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
        NotificationDetails notificationDetails = new NotificationDetails();

        User user = userClient.getUserById(order.getCustomerId());

        String email = user.getEmailId();
        notificationDetails.setRecipient(email);
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
        return orderRepository.findByOrderDateAfter(time);
    }

    @Override
    public Optional<Order> getOrderById(int orderId) {
        return orderRepository.findById(orderId);
    }
}