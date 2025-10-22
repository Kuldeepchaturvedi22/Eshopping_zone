package com.orderservice.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "payment")
public class Payment {

    // Shared primary key with Order
    @Id
    private int orderId;

    private String paymentId;
    private String paymentStatus;
    private double amount;
    private String paymentMethod;

    // Payment owns the FK to Order and shares the same PK via @MapsId
    @OneToOne
    @MapsId
    @JoinColumn(name = "order_id")
    @JsonIgnore
    @ToString.Exclude
    private Order order;
}