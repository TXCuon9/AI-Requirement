package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.Job.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IJobApplicationRepository extends JpaRepository<JobApplication,Long> {
    boolean existsByCandidateIdAndJobDescriptionId(Long candidateId, Long jobId);
    boolean existsByResumeIdAndJobDescriptionCompanyId(Long resumeId, Long companyId);
    
    List<JobApplication> findByCandidateId(Long candidateId);
    @Query("SELECT ja FROM JobApplication ja " +
            "JOIN ja.jobDescription  j " +
            "WHERE j.company.id = :companyId " +
            "ORDER BY ja.appliedAt DESC") // Đơn mới nộp xếp lên đầu
    List<JobApplication> findAllApplicationsByCompanyId(@Param("companyId") Long companyId);
}
