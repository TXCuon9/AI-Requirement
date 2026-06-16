package com.example.ai_requirement_be.dto.Company;

import com.example.ai_requirement_be.dto.RecruiterDto.JobResponseDTO;
import java.util.List;

public class CompanyDetailResponseDTO extends CompanyResponseDTO {
    private List<JobResponseDTO> jobs;

    public CompanyDetailResponseDTO() {
        super();
    }

    public CompanyDetailResponseDTO(Long id, String name, String description, String industry, String companySize, String website, String logoUrl, String location, Boolean verified, List<JobResponseDTO> jobs) {
        super(id, name, description, industry, companySize, website, logoUrl, location, verified);
        this.jobs = jobs;
    }

    public List<JobResponseDTO> getJobs() {
        return jobs;
    }

    public void setJobs(List<JobResponseDTO> jobs) {
        this.jobs = jobs;
    }
}
