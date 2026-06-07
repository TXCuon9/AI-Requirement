package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.Job.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IJobApplicationRepository extends JpaRepository<JobApplication,Long> {
    boolean existsByCandidateIdAndJobDescriptionId(Long candidateId, Long jobId);
}
