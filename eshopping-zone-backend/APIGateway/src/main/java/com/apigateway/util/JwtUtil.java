//package com.apigateway.util;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//
//@Component
//public class JwtUtil {
//
//    private static final String SECRET_KEY = "dGFyYXNuYWFheWF0dWpoa282NGticHN0YXJhc25hYWF5YXR1amhrbzcwMDBAQEANCg0K";
//    public static Claims extractClaims(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(getSignKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
//
//    public static Key getSignKey() {
//        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
//        return Keys.hmacShaKeyFor(keyBytes);
//    }
//
//    public static boolean isTokenExpired(Claims claims) {
//        return claims.getExpiration().before(new Date());
//    }
//
//    public static String getUsername(Claims claims) {
//        return claims.getSubject();
//    }
//
//    public static String getRoles(Claims claims) {
//        return claims.get("role", String.class);
//    }
//}

package com.apigateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "dGFyYXNuYWFheWF0dWpoa282NGticHN0YXJhc25hYWF5YXR1amhrbzcwMDBAQEANCg0K";

    public static Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public static boolean isTokenExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    public static String getUsername(Claims claims) {
        return claims.getSubject();
    }

    // Legacy single role accessor (kept for logs/backward compat)
    public static String getRoles(Claims claims) {
        String r = claims.get("role", String.class);
        if (r == null) r = claims.get("roles", String.class);
        return r;
    }

    // Preferred: list of roles, supports "role" or "roles" claim, comma/space separated
    public static List<String> getRolesList(Claims claims) {
        String roles = getRoles(claims);
        if (roles == null || roles.isBlank()) return List.of();
        String normalized = roles.replaceAll("\\s+", ",");
        return Arrays.stream(normalized.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}
