package com.example.ai_requirement_be.dto.User;

import com.example.ai_requirement_be.entity.UserManager.UserRole;
import com.example.ai_requirement_be.entity.UserManager.UserStatus;

import java.time.LocalDateTime;

public class UserPendingResponseDTO {
    private String email;
    private UserRole role;
    private String provider;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

   public UserPendingResponseDTO() {

   }

    public UserPendingResponseDTO(String email, UserRole role, String provider, UserStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.email = email;
        this.role = role;
        this.provider = provider;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
