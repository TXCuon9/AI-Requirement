package com.example.ai_requirement_be.dto.Auth;

import jakarta.validation.constraints.NotBlank;

public class TokenRefreshRequestDTO {
    @NotBlank(message = "Refesh Token không được để trống")
    private String refeshToken;

    public TokenRefreshRequestDTO() {

    }

    public TokenRefreshRequestDTO(String refeshToken) {
        this.refeshToken = refeshToken;
    }

    public String getRefeshToken() {
        return refeshToken;
    }

    public void setRefeshToken(String refeshToken) {
        this.refeshToken = refeshToken;
    }
}
