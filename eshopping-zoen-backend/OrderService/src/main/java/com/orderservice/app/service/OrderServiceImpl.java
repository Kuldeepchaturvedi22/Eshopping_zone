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
import java.util.*;
import java.util.stream.Collectors;

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

            System.out.println("Order placed successfully. Order ID: " + order.getOrderId() + ", Email: " + email);
            sendOrderConfirmationEmail(email, order, cartDTO.getTotalPrice(), paymentLink);
            order.setPaymentLink(paymentLink);
            orderRepository.save(order);
            
            // Clear cart after successful order placement
            cartClient.deleteByCustomerId(order.getCustomerId());
            System.out.println("Cart cleared for customer: " + order.getCustomerId());

            return order;

        } catch (Exception e) {
            System.out.println("Order placement failed: " + e.getMessage());
            order.setOrderStatus(Status.FAILED);
            order.getPayment().setPaymentStatus("FAILED");
            orderRepository.save(order);
            throw new OrderServiceException("Failed to initiate payment: " + e.getMessage());
        }
    }

    // ... existing code ...
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
                sendPaymentSuccessNotification(order, request);
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
        try {
            System.out.println("Sending order confirmation email to: " + email);
            // Prepare order data for professional email template
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("orderId", order.getOrderId());
            orderData.put("orderDate", order.getOrderDate().toString());
            orderData.put("totalAmount", totalAmount);
            orderData.put("paymentLink", paymentLink);
            orderData.put("customerEmail", email);
            
            // Send professional order confirmation email
            String result = notificationClient.sendOrderConfirmation(email, orderData);
            System.out.println("Order confirmation email result: " + result);
        } catch (Exception e) {
            System.out.println("Failed to send professional email, using fallback: " + e.getMessage());
            // Fallback to simple email if professional template fails
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
            String fallbackResult = notificationClient.sendEmail(notificationDetails);
            System.out.println("Fallback email result: " + fallbackResult);
        }
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

        sendOrderStatusUpdateNotification(order);
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
        LocalDate targetDate = time.toLocalDate();
        return orderRepository.findByOrderDate(targetDate);
    }

    @Override
    public Optional<Order> getOrderById(int orderId) {
        return orderRepository.findById(orderId);
    }

    @Override
    public List<OrderDetailDTO> getDetailedOrdersByCustomerId(int customerId) {
        List<Order> orderList = orderRepository.findByCustomerId(customerId);
        if (orderList.isEmpty()) {
            throw new OrderNotFoundException("You have not ordered yet!");
        }

        return orderList.stream()
                .map(this::convertToDetailDTO)
                .toList();
    }

    @Override
    public OrderDetailDTO getOrderDetails(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID " + orderId));

        return convertToDetailDTO(order);
    }

    private OrderDetailDTO convertToDetailDTO(Order order) {
        OrderDetailDTO dto = new OrderDetailDTO();

        // Basic order info
        dto.setOrderId(order.getOrderId());
        dto.setAmountPaid(order.getAmountPaid());
        dto.setCustomerId(order.getCustomerId());
        dto.setMerchantEmail(order.getMerchantEmail());
        dto.setModeOfPayment(order.getModeOfPayment());
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderStatus(order.getOrderStatus().toString());
        dto.setCartId(order.getCartId());
        dto.setRazorpayOrderId(order.getRazorpayOrderId());
        dto.setRazorpayPaymentId(order.getRazorpayPaymentId());
        dto.setPaymentLink(order.getPaymentLink());

        // Payment details
        if (order.getPayment() != null) {
            PaymentDetailDTO paymentDto = new PaymentDetailDTO();
            paymentDto.setPaymentId(order.getPayment().getPaymentId());
            paymentDto.setPaymentStatus(order.getPayment().getPaymentStatus());
            paymentDto.setPaymentMethod(order.getPayment().getPaymentMethod());
            paymentDto.setAmount(order.getPayment().getAmount());
            dto.setPayment(paymentDto);
        }

        // Address details
        if (order.getAddress() != null) {
            AddressDetailDTO addressDto = new AddressDetailDTO();
            addressDto.setStreet(order.getAddress().getStreet());
            addressDto.setCity(order.getAddress().getCity());
            addressDto.setState(order.getAddress().getState());
            addressDto.setCountry(order.getAddress().getCountry());
            addressDto.setZipCode(order.getAddress().getZipCode());
            dto.setAddress(addressDto);
        }

        // Cart and items details
        if (order.getCart() != null) {
            CartDetailDTO cartDto = new CartDetailDTO();
            cartDto.setTotalPrice(order.getCart().getTotalPrice());

            if (order.getCart().getItems() != null) {
                List<ItemDetailDTO> itemDtos = order.getCart().getItems().stream()
                        .map(item -> {
                            ItemDetailDTO itemDto = new ItemDetailDTO();
                            itemDto.setItemName(item.getItemName());
                            itemDto.setItemType(item.getItemType());
                            itemDto.setPrice(item.getPrice());
                            itemDto.setQuantity(item.getQuantity());
                            itemDto.setProductId(item.getProductId());
                            itemDto.setMerchantEmail(item.getMerchantEmail());
                            return itemDto;
                        })
                        .toList();
                cartDto.setItems(itemDtos);
            }
            dto.setCart(cartDto);
        }

        return dto;
    }

    private void sendPaymentSuccessNotification(Order order, PaymentDto paymentDto) {
        try {
            User user = userClient.getUserById(order.getCustomerId());
            System.out.println("Sending payment success notification to: " + user.getEmailId());
            
            // Prepare comprehensive order data for professional email with PDF receipt
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("orderId", order.getOrderId());
            orderData.put("orderDate", order.getOrderDate().toString());
            orderData.put("totalAmount", order.getAmountPaid());
            orderData.put("transactionId", paymentDto.getPaymentId());
            orderData.put("paymentMethod", paymentDto.getPaymentMethod());
            orderData.put("customerEmail", user.getEmailId());
            orderData.put("customerId", order.getCustomerId());
            
            // Add address information
            if (order.getAddress() != null) {
                Map<String, Object> address = new HashMap<>();
                address.put("street", order.getAddress().getStreet());
                address.put("city", order.getAddress().getCity());
                address.put("state", order.getAddress().getState());
                address.put("country", order.getAddress().getCountry());
                address.put("zipCode", order.getAddress().getZipCode());
                orderData.put("address", address);
            }
            
            // Add items information
            if (order.getCart() != null && order.getCart().getItems() != null) {
                List<Map<String, Object>> items = order.getCart().getItems().stream()
                        .map(item -> {
                            Map<String, Object> itemMap = new HashMap<>();
                            itemMap.put("itemName", item.getItemName());
                            itemMap.put("quantity", item.getQuantity());
                            itemMap.put("price", item.getPrice());
                            itemMap.put("productId", item.getProductId());
                            return itemMap;
                        })
                        .collect(Collectors.toList());
                orderData.put("items", items);
            }
            
            // Send professional payment success email with PDF receipt
            String result = notificationClient.sendPaymentSuccess(user.getEmailId(), orderData);
            System.out.println("Payment success email result: " + result);
            
            // Send merchant notification about the confirmed order
            if (order.getMerchantEmail() != null && !order.getMerchantEmail().isEmpty()) {
                String merchantResult = notificationClient.sendMerchantOrderNotification(order.getMerchantEmail(), orderData);
                System.out.println("Merchant notification result: " + merchantResult);
            }
        } catch (Exception e) {
            System.out.println("Failed to send payment success notification: " + e.getMessage());
            // Fallback to simple notification
            sendNotification(order, "Payment Successful",
                    "Your payment has been received and order is confirmed. Transaction ID: " + paymentDto.getPaymentId());
        }
    }

    private void sendOrderStatusUpdateNotification(Order order) {
        try {
            User user = userClient.getUserById(order.getCustomerId());
            System.out.println("Sending order status update to: " + user.getEmailId() + " for order: " + order.getOrderId());
            
            // Prepare order data for status update email
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("orderId", order.getOrderId());
            orderData.put("orderDate", order.getOrderDate().toString());
            orderData.put("totalAmount", order.getAmountPaid());
            orderData.put("orderStatus", order.getOrderStatus().toString());
            orderData.put("customerEmail", user.getEmailId());
            
            // Add tracking number if available (you can extend this based on your tracking system)
            if (order.getOrderStatus() == Status.SHIPPED) {
                orderData.put("trackingNumber", "TRK" + order.getOrderId() + System.currentTimeMillis());
            }
            
            // Send professional order status update email
            String result = notificationClient.sendOrderStatusUpdate(user.getEmailId(), orderData);
            System.out.println("Order status update email result: " + result);
        } catch (Exception e) {
            System.out.println("Failed to send status update notification: " + e.getMessage());
            // Fallback to simple notification
            try {
                User user = userClient.getUserById(order.getCustomerId());
                notificationDetails.setRecipient(user.getEmailId());
                notificationDetails.setSubject("Order Status Update");
                notificationDetails.setMsgBody("Your Order #" + order.getOrderId() + " status is now " + order.getOrderStatus());
                String fallbackResult = notificationClient.sendEmail(notificationDetails);
                System.out.println("Fallback status update email result: " + fallbackResult);
            } catch (Exception ex) {
                System.out.println("Failed to send fallback notification: " + ex.getMessage());
            }
        }
    }

    // Test method to verify notification service connectivity
    public void testNotificationService(String email) {
        try {
            notificationDetails.setRecipient(email);
            notificationDetails.setSubject("Test Notification");
            notificationDetails.setMsgBody("This is a test notification to verify service connectivity.");
            String result = notificationClient.sendEmail(notificationDetails);
            System.out.println("Test notification result: " + result);
        } catch (Exception e) {
            System.out.println("Test notification failed: " + e.getMessage());
        }
    }
}