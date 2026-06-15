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
}
