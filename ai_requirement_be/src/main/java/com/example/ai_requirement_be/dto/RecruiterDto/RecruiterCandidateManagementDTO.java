package com.example.ai_requirement_be.dto.RecruiterDto;

import java.time.LocalDateTime;

public class RecruiterCandidateManagementDTO {
    private Long applicationId;
    private String status;
    private LocalDateTime appliedAt;

    private Long candidateId;
    private String candidateName;
    private String candidateEmail;

    private Long resumeId;
    private String resumeTitle;
    private String resumeUrl;

    public RecruiterCandidateManagementDTO() {

    }

    public RecruiterCandidateManagementDTO(Long applicationId, String status, LocalDateTime appliedAt, Long candidateId, String candidateName, String candidateEmail, Long resumeId, String resumeTitle, String resumeUrl) {
        this.applicationId = applicationId;
        this.status = status;
        this.appliedAt = appliedAt;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.resumeId = resumeId;
        this.resumeTitle = resumeTitle;
        this.resumeUrl = resumeUrl;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public String getResumeTitle() {
        return resumeTitle;
    }

    public void setResumeTitle(String resumeTitle) {
        this.resumeTitle = resumeTitle;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }
}
