package com.example.ai_requirement_be.entity.Job;

import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.CandidateManager.Resume;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name="job_applications")
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="job_id" , nullable = false)
    private JobDescription jobDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id" , nullable = false)
    private CandidateProfile candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id" , nullable = false)
    private Resume resume;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private JobApplicationStatusEnum status = JobApplicationStatusEnum.APPLIED;

    @Column(name="applied_at" , insertable = false , updatable = false)
    private LocalDateTime appliedAt;


    public JobApplication() {

    }

    public JobApplication(Long id, JobDescription jobDescription, CandidateProfile candidate, Resume resume, JobApplicationStatusEnum status, LocalDateTime appliedAt) {
        this.id = id;
        this.jobDescription = jobDescription;
        this.candidate = candidate;
        this.resume = resume;
        this.status = status;
        this.appliedAt = appliedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JobDescription getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(JobDescription jobDescription) {
        this.jobDescription = jobDescription;
    }

    public CandidateProfile getCandidate() {
        return candidate;
    }

    public void setCandidate(CandidateProfile candidate) {
        this.candidate = candidate;
    }

    public Resume getResume() {
        return resume;
    }

    public void setResume(Resume resume) {
        this.resume = resume;
    }

    public JobApplicationStatusEnum getStatus() {
        return status;
    }

    public void setStatus(JobApplicationStatusEnum status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }
}
