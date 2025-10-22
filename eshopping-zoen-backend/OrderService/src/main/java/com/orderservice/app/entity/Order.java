package com.orderservice.app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "order_service")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int orderId;

    private double amountPaid;

    private int customerId;

    @NotBlank(message = "Mode of payment is required")
    private String modeOfPayment;

    @PastOrPresent(message = "Order date must be in the past or present")
    private LocalDate orderDate;

    @NotNull(message = "Order status is required")
    @Enumerated(EnumType.STRING)
    private Status orderStatus;

    // External cart-service id (reference only)
    private int cartId;

    // Merchant email derived from items at order-time
    private String merchantEmail;

    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;

    private String paymentLink;

    // Payment is owned by Payment (shared PK), cascade from Order for convenience
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @ToString.Exclude
    private Payment payment;

    // Address is owned by Address via its order_id FK, cascade from Order for convenience
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @ToString.Exclude
    private Address address;

    // Persist a snapshot of the cart and its items with the order (Order owns this relation)
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "order_cart_id")
    @ToString.Exclude
    private Cart cart;
}