package com.example.ai_requirement_be.dto.User;

import  com.example.ai_requirement_be.entity.UserManager.UserRole;
import com.example.ai_requirement_be.entity.UserManager.UserStatus;

import java.time.LocalDateTime;

public class UserPendingResponseDTO {
    private Long id;
    private String email;
    private UserRole role;
    private String provider;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Company specific fields
    private String companyName;
    private String companyDescription;
    private String industry;
    private String companySize;
    private String website;
    private String location;
    private String logoUrl;

   public UserPendingResponseDTO() {

   }
    public UserPendingResponseDTO(Long id, String email, UserRole role, String provider, UserStatus status, LocalDateTime createdAt, LocalDateTime updatedAt, String companyName, String companyDescription, String industry, String companySize, String website, String location, String logoUrl) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.provider = provider;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.companyName = companyName;
        this.companyDescription = companyDescription;
        this.industry = industry;
        this.companySize = companySize;
        this.website = website;
        this.location = location;
        this.logoUrl = logoUrl;
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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyDescription() {
        return companyDescription;
    }

    public void setCompanyDescription(String companyDescription) {
        this.companyDescription = companyDescription;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getCompanySize() {
        return companySize;
    }

    public void setCompanySize(String companySize) {
        this.companySize = companySize;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
}
