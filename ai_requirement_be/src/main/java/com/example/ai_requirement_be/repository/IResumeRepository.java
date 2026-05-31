package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.CandidateManager.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByCandidateIdOrderByCandidateIdAsc(CandidateProfile candidate);
}
