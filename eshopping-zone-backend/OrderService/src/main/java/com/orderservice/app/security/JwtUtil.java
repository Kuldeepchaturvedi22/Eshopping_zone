package com.orderservice.app.security;


import com.orderservice.app.exception.OrderServiceException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtUtil {

    private  String SECRET_KEY = "dGFyYXNuYWFheWF0dWpoa282NGticHN0YXJhc25hYWF5YXR1amhrbzcwMDBAQEANCg0K"; // Use a secure key in production

    public  String extractEmail(String token) {
        String tokenn = token;
        if (token != null && token.startsWith("Bearer ")) {
            tokenn = token.substring(7); // "Bearer" is 7 characters
        }

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(tokenn)
                    .getBody();

            System.out.println(claims);
            System.out.println(token);

            String email = claims.getSubject();
            System.out.println(claims);
            if (email == null || email.trim().isEmpty()) {
                System.out.println(email);
                throw new OrderServiceException("Email not found in token");
            }
            return email;
        } catch (JwtException e) {
            System.out.println(token);
            throw new OrderServiceException("Invalid JWT token: " + e.getMessage());
        }
    }

    private  Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}