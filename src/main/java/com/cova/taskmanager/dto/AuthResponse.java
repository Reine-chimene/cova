package com.cova.taskmanager.dto;

public class AuthResponse {

    private String accessToken;
    private String tokenType;
    private String email;

    public AuthResponse() {
    }

    public AuthResponse(String accessToken, String tokenType, String email) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.email = email;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
