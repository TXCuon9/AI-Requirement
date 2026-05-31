package com.example.ai_requirement_be.dto.Candidate;

import com.example.ai_requirement_be.entity.CandidateManager.Gender;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class UpdateCandidateProfileDTO {
    @Size(max = 255 , message = "Họ và tên không được vượt quá 255 kí tự")
    private String fullName;

    @Size(max = 20 , message = "Số điện thoại không được vượt quá 20 kí tự")
    private String phone;

    private String avatarUrl;
    private LocalDateTime dob;

    private Gender gender;
    private String address;
    private String bio;

    @Size(max = 255 , message = "Vị trí hiện tại không được vượt quá 255 kí tự")
    private String currentPosition;

    private Integer experienceYears;
    private BigDecimal expectedSalary;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private Boolean isLookingForJob;

    public UpdateCandidateProfileDTO() {

    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public LocalDateTime getDob() {
        return dob;
    }

    public void setDob(LocalDateTime dob) {
        this.dob = dob;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getCurrentPosition() {
        return currentPosition;
    }

    public void setCurrentPosition(String currentPosition) {
        this.currentPosition = currentPosition;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public BigDecimal getExpectedSalary() {
        return expectedSalary;
    }

    public void setExpectedSalary(BigDecimal expectedSalary) {
        this.expectedSalary = expectedSalary;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public Boolean getIsLookingForJob() {
        return isLookingForJob;
    }

    public void setIsLookingForJob(Boolean isLookingForJob) {
        this.isLookingForJob = isLookingForJob;
    }
}
