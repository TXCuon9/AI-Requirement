package com.example.ai_requirement_be.dto.RecruiterDto;

import com.example.ai_requirement_be.entity.RecruiterManager.ExperienceLevel;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.RecruiterManager.JobStatus;
import com.example.ai_requirement_be.entity.RecruiterManager.JobType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class JobResponseDTO {
    private Long id;
    private String companyName; // Trả thêm tên công ty ra ngoài
    private String title;
    private String description;
    private String requirements;
    private String responsibilities;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String location;
    private Boolean remote;
    private JobType jobType;
    private ExperienceLevel experienceLevel;
    private JobStatus status;
    private LocalDateTime expiredAt;
    private LocalDateTime createdAt;

    public JobResponseDTO(JobDescription job) {
        this.id = job.getId();
        if (job.getCompany() != null) {
            this.companyName = job.getCompany().getName();
        }
        this.title = job.getTitle();
        this.description = job.getDescription();
        this.requirements = job.getRequirements();
        this.responsibilities = job.getResponsibilities();
        this.salaryMin = job.getSalaryMin();
        this.salaryMax = job.getSalaryMax();
        this.location = job.getLocation();
        this.remote = job.getRemote();
        this.jobType = job.getJobType();
        this.experienceLevel = job.getExperienceLevel();
        this.status = job.getStatus();
        this.expiredAt = job.getExpiredAt();
        this.createdAt = job.getCreatedAt();
    }

    public Long getId() { return id; }
    public String getCompanyName() { return companyName; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getRequirements() { return requirements; }
    public String getResponsibilities() { return responsibilities; }
    public BigDecimal getSalaryMin() { return salaryMin; }
    public BigDecimal getSalaryMax() { return salaryMax; }
    public String getLocation() { return location; }
    public Boolean getRemote() { return remote; }
    public JobType getJobType() { return jobType; }
    public ExperienceLevel getExperienceLevel() { return experienceLevel; }
    public JobStatus getStatus() { return status; }
    public LocalDateTime getExpiredAt() { return expiredAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
