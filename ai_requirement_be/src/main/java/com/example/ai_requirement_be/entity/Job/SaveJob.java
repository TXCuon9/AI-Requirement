package com.example.ai_requirement_be.entity.Job;

import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="saved_job")
public class SaveJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="candidate_id" , nullable = false)
    private CandidateProfile candidateProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="job_id" , nullable = false)
    private JobDescription jobDescription;

    @Column(name="created_at" , insertable = false , updatable = false)
    private LocalDateTime createdAt;

    public SaveJob() {

    }

    public SaveJob(CandidateProfile candidateProfile, JobDescription jobDescription, LocalDateTime createdAt) {
        this.candidateProfile = candidateProfile;
        this.jobDescription = jobDescription;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CandidateProfile getCandidateProfile() {
        return candidateProfile;
    }

    public void setCandidateProfile(CandidateProfile candidateProfile) {
        this.candidateProfile = candidateProfile;
    }

    public JobDescription getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(JobDescription jobDescription) {
        this.jobDescription = jobDescription;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


}
