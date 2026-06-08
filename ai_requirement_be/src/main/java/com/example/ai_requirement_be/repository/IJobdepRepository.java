package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.RecruiterManager.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IJobdepRepository extends JpaRepository<JobDescription, Long> {
    List<JobDescription> findByJobType(JobType jobType);
    List<JobDescription> findByExperienceLevel(String experienceLevel);
    List<JobDescription> findByCompany_Id(Long companyId);
}
