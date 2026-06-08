package com.example.ai_requirement_be.dto.Job;


import java.math.BigDecimal;

public class JobviewResponseDTO {
    private Long id;
    private String companyName;
    private String title;
    private String description;
    private String requirements;
    private String responsibilities;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String location;
    private boolean remote;
    private String jobType;
    private String experienceLevel;

    public JobviewResponseDTO() {

    }

    public JobviewResponseDTO(Long id, String companyName, String title, String description, String requirements, String responsibilities, BigDecimal salaryMin, BigDecimal salaryMax, String location, boolean remote, String jobType, String experienceLevel) {
        this.id = id;
        this.companyName = companyName;
        this.title = title;
        this.description = description;
        this.requirements = requirements;
        this.responsibilities = responsibilities;
        this.salaryMin = salaryMin;
        this.salaryMax = salaryMax;
        this.location = location;
        this.remote = remote;
        this.jobType = jobType;
        this.experienceLevel = experienceLevel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getResponsibilities() {
        return responsibilities;
    }

    public void setResponsibilities(String responsibilities) {
        this.responsibilities = responsibilities;
    }

    public BigDecimal getSalaryMin() {
        return salaryMin;
    }

    public void setSalaryMin(BigDecimal salaryMin) {
        this.salaryMin = salaryMin;
    }

    public BigDecimal getSalaryMax() {
        return salaryMax;
    }

    public void setSalaryMax(BigDecimal salaryMax) {
        this.salaryMax = salaryMax;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isRemote() {
        return remote;
    }

    public void setRemote(boolean remote) {
        this.remote = remote;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }
}
