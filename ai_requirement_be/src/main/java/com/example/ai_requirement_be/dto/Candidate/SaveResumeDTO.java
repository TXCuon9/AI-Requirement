package com.example.ai_requirement_be.dto.Candidate;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class SaveResumeDTO {
    // Các trường mặc định
    @NotBlank(message = "Đường dẫn file CV không được để trống")
    private String fileUrl;

    private String parsedText;
    private String summary;
    private Integer version = 1;

    // Hứng các mảng dữ liệu trong mảng Json trước đó
    private List<String> skills;
    

    private List<ExperienceItemDTO>  experienceItems;
    

    private List<EducationItemDTO>   educationItems;

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
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
}
