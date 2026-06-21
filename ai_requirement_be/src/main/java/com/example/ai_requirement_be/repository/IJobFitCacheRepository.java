package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.Job.JobFitCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IJobFitCacheRepository extends JpaRepository<JobFitCache, Long> {
    Optional<JobFitCache> findByResumeIdAndJobId(Long resumeId, Long jobId);
}
