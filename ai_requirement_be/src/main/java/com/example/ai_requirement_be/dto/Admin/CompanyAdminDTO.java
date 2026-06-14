package com.example.ai_requirement_be.dto.Admin;

import com.example.ai_requirement_be.entity.UserManager.UserStatus;

public class CompanyAdminDTO {
    private Long id; // This is the user id representing the company
    private String name;
    private String email;
    private String industry;
    private String companySize;
    private String location;
    private Boolean verified;
    private UserStatus status;

    public CompanyAdminDTO() {
    }

    public CompanyAdminDTO(Long id, String name, String email, String industry, String companySize, String location, Boolean verified, UserStatus status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.industry = industry;
        this.companySize = companySize;
        this.location = location;
        this.verified = verified;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}
