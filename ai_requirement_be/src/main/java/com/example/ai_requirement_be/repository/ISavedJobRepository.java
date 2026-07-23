package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.Job.SaveJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ISavedJobRepository extends JpaRepository<SaveJob , Long> {
    boolean existsByCandidateProfileIdAndJobDescriptionId(long candidateId, long jobId);
    
    List<SaveJob> findByCandidateProfileId(Long candidateId);
}
