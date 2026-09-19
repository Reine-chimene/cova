package com.cova.taskmanager.security;

import com.cova.taskmanager.exception.InvalidJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        JwtProperties properties = new JwtProperties();
        properties.setSecret("test-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm");
        properties.setExpiration(3600000);
        jwtService = new JwtService(properties);
    }

    @Test
    void generateToken_extractEmail_andValidate() {
        String token = jwtService.generateToken("user@example.com");

        assertTrue(jwtService.isTokenValid(token));
        assertEquals("user@example.com", jwtService.extractEmail(token));
    }

    @Test
    void invalidToken_throwsInvalidJwtException() {
        assertThrows(InvalidJwtException.class, () -> jwtService.isTokenValid("not-a-valid-token"));
    }
}
