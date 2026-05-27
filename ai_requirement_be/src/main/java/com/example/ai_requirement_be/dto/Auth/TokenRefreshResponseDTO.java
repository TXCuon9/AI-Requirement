package com.example.ai_requirement_be.dto.Auth;

public class TokenRefreshResponseDTO {
    private String accessToken;
    private String refreshToken;

    public TokenRefreshResponseDTO() {

    }

    public TokenRefreshResponseDTO(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
