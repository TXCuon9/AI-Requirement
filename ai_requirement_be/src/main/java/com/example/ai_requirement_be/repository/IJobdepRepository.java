package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IJobdepRepository extends JpaRepository<JobDescription, Long> {
}
