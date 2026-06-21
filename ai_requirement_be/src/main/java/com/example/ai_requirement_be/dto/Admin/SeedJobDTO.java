package com.example.ai_requirement_be.dto.Admin;

public class SeedJobDTO {
    private String companyName;
    private String companyLogoUrl;
    private String companyDescription;
    private String jobTitle;
    private String jobDescription;
    private String jobRequirement;
    private String jobBenefit;
    private String salary;
    private String location;
    private String deadline;

    public SeedJobDTO() {}

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyLogoUrl() { return companyLogoUrl; }
    public void setCompanyLogoUrl(String companyLogoUrl) { this.companyLogoUrl = companyLogoUrl; }

    public String getCompanyDescription() { return companyDescription; }
    public void setCompanyDescription(String companyDescription) { this.companyDescription = companyDescription; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }

    public String getJobRequirement() { return jobRequirement; }
    public void setJobRequirement(String jobRequirement) { this.jobRequirement = jobRequirement; }

    public String getJobBenefit() { return jobBenefit; }
    public void setJobBenefit(String jobBenefit) { this.jobBenefit = jobBenefit; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }
}
