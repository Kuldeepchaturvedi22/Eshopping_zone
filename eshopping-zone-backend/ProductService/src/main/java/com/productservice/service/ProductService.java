package com.productservice.service;

import com.productservice.entity.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.util.List;


public interface ProductService {

    ResponseEntity<Product> addProduct(Product product);

    ResponseEntity<String> deleteProductById(int productId);

    ResponseEntity<List<Product>> getAllProducts();

    ResponseEntity<Product> updateProductById(int productId, Product product);

    ResponseEntity<Product> getProductById(int productId);

    ResponseEntity<List<Product>> findByMerchantEmail(String email);
}
