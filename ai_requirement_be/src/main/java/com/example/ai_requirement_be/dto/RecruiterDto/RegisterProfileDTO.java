package com.example.ai_requirement_be.dto.RecruiterDto;

public class RegisterProfileDTO {
    private String email;
    private Long companyId;
    private String tempUsername;

    public RegisterProfileDTO() {

    }
    public RegisterProfileDTO(String email , long companyId) {
        this.email = email;
        if (email != null && email.contains("@")) {
            this.tempUsername = email.replace("@", "");
        } else {
            this.tempUsername = email;
        }
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getTempUsername() {
        return tempUsername;
    }

    public void setTempUsername(String tempUsername) {
        this.tempUsername = tempUsername;
    }
}
