package com.example.ai_requirement_be.dto.Company;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateCompanyDTO {
    @NotBlank(message = "Tên công ty không được để trống")
    @Size(max = 255 , message = "Tên công ty không được vươt quá 255 ký tự")
    private String name;
    private String description;

    @Size(max = 255 , message = "Ngành nghề không được vượt quá 255 ký tự")
    private String industry;

    @Size(max = 100 , message = "Quy mô công ty không được vượt quá 100 kí tự")
    private String companySize;

    @Size(max = 255 , message = "địa chỉ website không được vượt quá 255 ký tự")
    private String website;

    private String logoUrl;

    @Size(max = 255, message = "Địa chỉ công ty không được vượt quá 255 ký tự")
    private String location;

    public UpdateCompanyDTO() {

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
}
