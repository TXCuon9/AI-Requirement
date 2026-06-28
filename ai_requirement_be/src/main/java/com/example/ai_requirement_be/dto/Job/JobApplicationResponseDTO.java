package com.example.ai_requirement_be.dto.Job;

import java.time.LocalDateTime;

public class JobApplicationResponseDTO {
    private Long applicationId;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private Long resumeId;
    private String resumeUrl; // Đường dẫn file CV của ứng viên
    private String status;    // Trạng thái (APPLIED, REVIEWING...)
    private LocalDateTime appliedAt;
    private String companyName;
    private String jobTitle;
    private double salary;
    private String contractDate;
    private String startDate;

    public JobApplicationResponseDTO() {
    }

    public JobApplicationResponseDTO(Long applicationId, Long candidateId, String candidateName,
                                     String candidateEmail, Long resumeId, String resumeUrl,
                                     String status, LocalDateTime appliedAt, String companyName , String jobTitle , String contractDate, String startDate) {
        this.applicationId = applicationId;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.resumeId = resumeId;
        this.resumeUrl = resumeUrl;
        this.status = status;
        this.appliedAt = appliedAt;
        this.companyName = companyName;
        this.jobTitle = jobTitle;
        this.salary = salary;
        this.contractDate = contractDate;
        this.startDate = startDate;
    }
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public String getContractDate() {
        return contractDate;
    }

    public void setContractDate(String contractDate) {
        this.contractDate = contractDate;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }
}
