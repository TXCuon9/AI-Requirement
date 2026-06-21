package com.example.ai_requirement_be.entity.Job;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name="job_fit_caches")
public class JobFitCache {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="resume_id", nullable = false)
    private Long resumeId;

    @Column(name="job_id", nullable = false)
    private Long jobId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name="match_result", columnDefinition = "JSON")
    private Map<String, Object> matchResult;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public JobFitCache() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public Map<String, Object> getMatchResult() { return matchResult; }
    public void setMatchResult(Map<String, Object> matchResult) { this.matchResult = matchResult; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
