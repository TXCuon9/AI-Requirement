package com.example.ai_requirement_be.dto.Admin;

import com.example.ai_requirement_be.entity.RecruiterManager.JobStatus;
public class JobAdminDTO {
    private Long id;
    private String title;
    private String companyName;
    private String industry;
    private JobStatus status;

    public JobAdminDTO() {}

    public JobAdminDTO(Long id, String title, String companyName, String industry, JobStatus status) {
        this.id = id;
        this.title = title;
        this.companyName = companyName;
        this.industry = industry;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }
}
