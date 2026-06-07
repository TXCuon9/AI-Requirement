package com.example.ai_requirement_be.dto.Job;

public class JobApplicationRequestDTO {
    private Long resumeId;

    public JobApplicationRequestDTO() {

    }

    public JobApplicationRequestDTO(Long resumeId) {
        this.resumeId = resumeId;
    }

    public Long getResumeId() {
        return resumeId;
    }
    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }
}
