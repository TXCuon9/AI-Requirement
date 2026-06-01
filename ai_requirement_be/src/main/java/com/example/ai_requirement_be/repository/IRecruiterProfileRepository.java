package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.RecruiterManager.RecruiterProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IRecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long> {
    Optional<RecruiterProfile> findByUserId(long id);
}
