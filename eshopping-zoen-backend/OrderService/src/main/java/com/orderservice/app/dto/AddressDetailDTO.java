package com.orderservice.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDetailDTO {
    private String street;
    private String city;
    private String state;
    private String country;
    private String zipCode;
}
