package com.example.ai_requirement_be.dto.Job;

import java.time.LocalDateTime;

public class SavedJobResponseDTO {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private LocalDateTime savedAt;

    public SavedJobResponseDTO() {

    }

    public SavedJobResponseDTO(Long id, Long jobId, String jobTitle, String companyName, LocalDateTime createdAt) {
        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.savedAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }

    public void setSavedAt(LocalDateTime savedAt) {
        this.savedAt = savedAt;
    }
}
