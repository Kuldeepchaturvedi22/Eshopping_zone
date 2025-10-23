package com.apigateway;

import com.apigateway.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.Test;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private static final String TEST_USERNAME = "testuser";
    private static final String TEST_ROLE = "ADMIN";

    @Test
    void shouldExtractClaimsFromValidToken() {
        // Given
        String token = generateTestToken();

        // When
        Claims claims = JwtUtil.extractClaims(token);

        // Then
        assertNotNull(claims);
        assertEquals(TEST_USERNAME, claims.getSubject());
        assertEquals(TEST_ROLE, claims.get("role"));
    }

    @Test
    void shouldValidateTokenExpiration() {
        // Given
        String expiredToken = generateExpiredToken();
        String validToken = generateTestToken();

        // When
        Claims expiredClaims = JwtUtil.extractClaims(expiredToken);
        Claims validClaims = JwtUtil.extractClaims(validToken);

        // Then
        assertTrue(JwtUtil.isTokenExpired(expiredClaims));
        assertFalse(JwtUtil.isTokenExpired(validClaims));
    }

    @Test
    void shouldExtractUsername() {
        // Given
        String token = generateTestToken();
        Claims claims = JwtUtil.extractClaims(token);

        // When
        String username = JwtUtil.getUsername(claims);

        // Then
        assertEquals(TEST_USERNAME, username);
    }

    @Test
    void shouldExtractRoles() {
        // Given
        String token = generateTestToken();
        Claims claims = JwtUtil.extractClaims(token);

        // When
        String roles = JwtUtil.getRoles(claims);

        // Then
        assertEquals(TEST_ROLE, roles);
    }

    private String generateTestToken() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", TEST_ROLE);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(TEST_USERNAME)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(JwtUtil.getSignKey())
                .compact();
    }

    private String generateExpiredToken() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", TEST_ROLE);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(TEST_USERNAME)
                .setIssuedAt(new Date(System.currentTimeMillis() - 2000 * 60 * 60))
                .setExpiration(new Date(System.currentTimeMillis() - 1000 * 60 * 60)) // 1 hour ago
                .signWith(JwtUtil.getSignKey())
                .compact();
    }
}