package com.orderservice.app.feign;

import com.orderservice.app.dto.CartDTO;
import com.orderservice.app.entity.Cart;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "CARTSERVICE")
public interface CartClient {

    @GetMapping("/carts/getByCustomerId/{customerId}")
    List<CartDTO> getByCustomerId(@PathVariable("customerId") int userId);

    @DeleteMapping("/carts/deleteByCustomerId/{userId}")
    void deleteByCustomerId(@PathVariable("userId") int userId);
}