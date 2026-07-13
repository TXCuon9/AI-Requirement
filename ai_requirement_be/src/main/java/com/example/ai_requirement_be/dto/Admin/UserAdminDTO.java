package com.example.ai_requirement_be.dto.Admin;

import com.example.ai_requirement_be.entity.UserManager.UserRole;
import com.example.ai_requirement_be.entity.UserManager.UserStatus;
public class UserAdminDTO {
    private Long id;
    private String email;
    private UserRole role;
    private UserStatus status;

    public UserAdminDTO() {}

    public UserAdminDTO(Long id, String email, UserRole role, UserStatus status) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}
