package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.UserManager.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ICandidateRepository extends JpaRepository<CandidateProfile,Long> {
    Optional<CandidateProfile> findByUser(User user);
}
