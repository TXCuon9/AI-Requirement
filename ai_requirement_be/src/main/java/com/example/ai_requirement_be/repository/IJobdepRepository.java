package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.RecruiterManager.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface IJobdepRepository extends JpaRepository<JobDescription, Long> {
    List<JobDescription> findByJobType(JobType jobType);
    List<JobDescription> findByExperienceLevel(String experienceLevel);
    List<JobDescription> findByCompany_Id(Long companyId);

    @Query("SELECT j FROM JobDescription j WHERE " +
           "(:keywordIsNull = true OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.company.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:locationIsNull = true OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:industryIsNull = true OR LOWER(j.company.industry) LIKE LOWER(CONCAT('%', :industry, '%'))) AND " +
           "(:experienceLevelIsNull = true OR j.experienceLevel = :experienceLevel) AND " +
           "(:jobTypeIsNull = true OR j.jobType = :jobType) AND " +
           "(:salaryMinIsNull = true OR j.salaryMin >= :salaryMin OR j.salaryMax >= :salaryMin) AND " +
           "j.status = 'OPEN' AND " +
           "(j.expiredAt IS NULL OR j.expiredAt > CURRENT_TIMESTAMP)")
    List<JobDescription> searchJobs(
            @Param("keyword") String keyword, @Param("keywordIsNull") boolean keywordIsNull,
            @Param("location") String location, @Param("locationIsNull") boolean locationIsNull,
            @Param("industry") String industry, @Param("industryIsNull") boolean industryIsNull,
            @Param("experienceLevel") com.example.ai_requirement_be.entity.RecruiterManager.ExperienceLevel experienceLevel, @Param("experienceLevelIsNull") boolean experienceLevelIsNull,
            @Param("jobType") JobType jobType, @Param("jobTypeIsNull") boolean jobTypeIsNull,
            @Param("salaryMin") BigDecimal salaryMin, @Param("salaryMinIsNull") boolean salaryMinIsNull
    );
}
