package com.project.service;

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
import com.orderservice.app.service.OrderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OrderServiceImplTest {

    @InjectMocks
    private OrderServiceImpl orderService;

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private CartClient cartClient;
    @Mock
    private UserClient userClient;
    @Mock
    private NotificationClient notificationClient;
    @Mock
    private NotificationDetails notificationDetails;
    @Mock
    private JwtUtil jwtUtil;

    private Order mockOrder;
    private CartDTO mockCartDTO;
    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockOrder = new Order();
        mockOrder.setOrderId(1);
        mockOrder.setCartId(1);
        mockOrder.setCustomerId(1);
        mockOrder.setOrderStatus(Status.PLACED);
        mockOrder.setAmountPaid(1000.0);
        mockOrder.setOrderDate(LocalDate.now());

        mockCartDTO = new CartDTO();
        mockCartDTO.setCartId(1);
        mockCartDTO.setTotalPrice(1000.0);
        mockCartDTO.setCustomerId(1);

        mockUser = new User(1, "Test User", "test@example.com");
    }

    @Test
    void testPlaceOrder_Success() {
        String token = "Bearer token";
        when(jwtUtil.extractEmail(token)).thenReturn("test@example.com");
        when(userClient.getUserByEmail("test@example.com")).thenReturn(mockUser);
        when(cartClient.getByCustomerId(1)).thenReturn(Collections.singletonList(mockCartDTO));
        when(userClient.getUserAddress(1)).thenReturn(new AddressDto("Street", "City", "12345", "State", "Country"));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setOrderId(1);
            return o;
        });

        Order result = orderService.placeOrder(token);

        assertNotNull(result);
        assertEquals(1, result.getOrderId());
        assertEquals(Status.PENDING, result.getOrderStatus());
        verify(notificationClient, atLeastOnce()).sendEmail(any(NotificationDetails.class));
    }

    @Test
    void testPlaceOrder_EmptyCart() {
        String token = "Bearer token";
        when(jwtUtil.extractEmail(token)).thenReturn("test@example.com");
        when(userClient.getUserByEmail("test@example.com")).thenReturn(mockUser);
        when(cartClient.getByCustomerId(1)).thenReturn(Collections.emptyList());

        assertThrows(CartNotFoundException.class, () -> orderService.placeOrder(token));
    }

    @Test
    void testPlaceOrder_ExceptionOnNotification() {
        String token = "Bearer token";
        when(jwtUtil.extractEmail(token)).thenReturn("test@example.com");
        when(userClient.getUserByEmail("test@example.com")).thenReturn(mockUser);
        when(cartClient.getByCustomerId(1)).thenReturn(Collections.singletonList(mockCartDTO));
        when(userClient.getUserAddress(1)).thenReturn(new AddressDto("Street", "City", "12345", "State", "Country"));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setOrderId(1);
            return o;
        });
        doThrow(new RuntimeException("Mail error")).when(notificationClient).sendEmail(any(NotificationDetails.class));

        assertThrows(OrderServiceException.class, () -> orderService.placeOrder(token));
    }

    @Test
    void testUpdatePaymentStatus_Completed() {
        PaymentDto paymentDto = new PaymentDto(1, "razorpayId", "paymentId", "COMPLETED", 1000.0, "UPI", "txn");
        Order order = new Order();
        order.setOrderId(1);
        order.setCustomerId(1);
        Payment payment = new Payment();
        order.setPayment(payment);

        when(orderRepository.findById(1)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(userClient.getUserById(1)).thenReturn(mockUser);

        Order result = orderService.updatePaymentStatus(paymentDto);

        assertEquals(Status.PLACED, result.getOrderStatus());
        assertEquals("COMPLETED", result.getPayment().getPaymentStatus());
        verify(cartClient).deleteByCustomerId(1);
        verify(notificationClient).sendEmail(any(NotificationDetails.class));
    }

    @Test
    void testUpdatePaymentStatus_Failed() {
        PaymentDto paymentDto = new PaymentDto(1, "razorpayId", "paymentId", "FAILED", 1000.0, "UPI", "txn");
        Order order = new Order();
        order.setOrderId(1);
        order.setCustomerId(1);
        Payment payment = new Payment();
        order.setPayment(payment);

        when(orderRepository.findById(1)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(userClient.getUserById(1)).thenReturn(mockUser);

        Order result = orderService.updatePaymentStatus(paymentDto);

        assertEquals(Status.FAILED, result.getOrderStatus());
        assertEquals("FAILED", result.getPayment().getPaymentStatus());
        verify(notificationClient).sendEmail(any(NotificationDetails.class));
    }

    @Test
    void testUpdatePaymentStatus_OrderNotFound() {
        PaymentDto paymentDto = new PaymentDto();
        paymentDto.setOrderId(999);
        when(orderRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class, () -> orderService.updatePaymentStatus(paymentDto));
    }

    @Test
    void testGetOrderByCustomerId_Success() {
        List<Order> orders = Collections.singletonList(mockOrder);
        when(orderRepository.findByCustomerId(1)).thenReturn(orders);

        List<OrderDTO> result = orderService.getOrderByCustomerId(1);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(mockOrder.getOrderId(), result.get(0).getOrderId());
    }

    @Test
    void testGetOrderByCustomerId_NoOrders() {
        when(orderRepository.findByCustomerId(1)).thenReturn(Collections.emptyList());

        assertThrows(OrderNotFoundException.class, () -> orderService.getOrderByCustomerId(1));
    }

    @Test
    void testGetAllOrders_Success() {
        List<Order> orders = Collections.singletonList(mockOrder);
        when(orderRepository.findAll()).thenReturn(orders);

        List<Order> result = orderService.getAllOrders();

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void testGetAllOrders_Empty() {
        when(orderRepository.findAll()).thenReturn(Collections.emptyList());

        assertThrows(OrderNotFoundException.class, () -> orderService.getAllOrders());
    }

    @Test
    void testChangeOrderStatus_Success() {
        when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));
        when(userClient.getUserById(1)).thenReturn(mockUser);
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);

        Order result = orderService.changeOrderStatus(Status.SHIPPED, 1);

        assertEquals(Status.SHIPPED, result.getOrderStatus());
        verify(notificationClient).sendEmail(any(NotificationDetails.class));
    }

    @Test
    void testChangeOrderStatus_OrderNotFound() {
        when(orderRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class, () -> orderService.changeOrderStatus(Status.SHIPPED, 999));
    }

    @Test
    void testCancelOrder_Success() {
        when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));

        String result = orderService.cancelOrder(1);

        assertEquals("Successfully Deleted", result);
        verify(orderRepository).delete(mockOrder);
    }

    @Test
    void testCancelOrder_NotFound() {
        when(orderRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class, () -> orderService.cancelOrder(999));
    }

    @Test
    void testGetLatestOrdersWithTime_Success() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<Order> orders = Collections.singletonList(mockOrder);

        when(orderRepository.findByOrderDateAfter(LocalDate.from(oneHourAgo))).thenReturn(orders);

        List<Order> result = orderService.getLatestOrdersWithTime(oneHourAgo);

        assertNotNull(result);
        assertEquals(1, result.size());
    }
}