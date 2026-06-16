package com.example.ai_requirement_be.dto.Company;

public class CompanyResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String industry;
    private String companySize;
    private String website;
    private String logoUrl;
    private String location;
    private Boolean verified;

    public CompanyResponseDTO() {

    }
    public CompanyResponseDTO(Long id, String name, String description, String industry, String companySize, String website, String logoUrl, String location, Boolean verified) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.industry = industry;
        this.companySize = companySize;
        this.website = website;
        this.logoUrl = logoUrl;
        this.location = location;
        this.verified = verified;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getCompanySize() {
        return companySize;
    }

    public void setCompanySize(String companySize) {
        this.companySize = companySize;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
}
