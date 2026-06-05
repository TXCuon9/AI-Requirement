package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.Job.JobView;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IJobviewRepository extends JpaRepository<JobView, Long> {
}
