package com.apigateway.config;

import com.apigateway.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .authorizeExchange(exchanges -> exchanges
                        // Auth endpoints
                        .pathMatchers("/userservice/auth/**").permitAll()

                        // User service
                        .pathMatchers("/userservice/user/getAllUsers").hasRole("ADMIN")
                        .pathMatchers("/userservice/user/**").hasAnyRole("ADMIN", "MERCHANT", "CUSTOMER")

                        // Product service
                        .pathMatchers("/productservice/products/getAllProducts").permitAll()
                        .pathMatchers("/productservice/products/**").hasAnyRole("ADMIN", "MERCHANT")

                        // Notification service
                        .pathMatchers("/notificationservice/notification/**").hasAnyRole("ADMIN", "MERCHANT")

                        // Cart service
                        .pathMatchers("/cartservice/carts/**").hasAnyRole("CUSTOMER", "MERCHANT", "ADMIN")

                        // Order service
                        .pathMatchers("/orderservice/orders/placeOrder",
                                "/orderservice/orders/customer/**",
                                "/orderservice/orders/cancelOrder/**").hasAnyRole("CUSTOMER", "ADMIN")
                        .pathMatchers("/orderservice/orders/getAllOrders",
                                "/orderservice/orders/changeOrderStatus/**").hasAnyRole("MERCHANT", "ADMIN")

                        .anyExchange().authenticated()
                )
                .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(exchange -> {
                    CorsConfiguration cfg = new CorsConfiguration();
                    // Use patterns to be flexible in dev
                    cfg.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
                    cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
                    cfg.setAllowedHeaders(List.of("*"));
                    cfg.setExposedHeaders(List.of("Authorization", "Content-Type"));
                    cfg.setAllowCredentials(true);
                    return cfg;
                }))
                .build();
    }
}