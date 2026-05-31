package com.example.ai_requirement_be.dto.Candidate;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class SaveResumeDTO {
    // Các trường mặc định
    @NotBlank(message = "Đường dẫn file CV không được để trống")
    private String fileUrl;

    private String cvName;
    private String parsedText;
    private String summary;
    private Integer version = 1;

    // Custom personal info for CV Builder
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String targetPosition;
    private String avatarUrl;
    private String githubUrl;
    private String linkedinUrl;
    private String dob;
    private String gender;
    private String hobbies;

    // Hứng các mảng dữ liệu trong mảng Json trước đó
    private List<String> skills;
    

    private List<ExperienceItemDTO>  experienceItems;
    

    private List<EducationItemDTO>   educationItems;

    private List<ProjectItemDTO> projectItems;

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getCvName() {
        return cvName;
    }

    public void setCvName(String cvName) {
        this.cvName = cvName;
    }

    public String getParsedText() {
        return parsedText;
    }

    public void setParsedText(String parsedText) {
        this.parsedText = parsedText;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<ExperienceItemDTO> getExperienceItems() {
        return experienceItems;
    }

    public void setExperienceItems(List<ExperienceItemDTO> experienceItems) {
        this.experienceItems = experienceItems;
    }

    public List<EducationItemDTO> getEducationItems() {
        return educationItems;
    }

    public void setEducationItems(List<EducationItemDTO> educationItems) {
        this.educationItems = educationItems;
    }

    public List<ProjectItemDTO> getProjectItems() {
        return projectItems;
    }

    public void setProjectItems(List<ProjectItemDTO> projectItems) {
        this.projectItems = projectItems;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getTargetPosition() { return targetPosition; }
    public void setTargetPosition(String targetPosition) { this.targetPosition = targetPosition; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getHobbies() { return hobbies; }
    public void setHobbies(String hobbies) { this.hobbies = hobbies; }
}
