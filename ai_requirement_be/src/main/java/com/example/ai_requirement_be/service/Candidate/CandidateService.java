package com.example.ai_requirement_be.service.Candidate;

import com.example.ai_requirement_be.dto.Candidate.UpdateCandidateProfileDTO;
import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.repository.ICandidateRepository;
import com.example.ai_requirement_be.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CandidateService {
    private final IUserRepository userRepository;
    private final ICandidateRepository candidateRepository;
    @Autowired
    public CandidateService(IUserRepository userRepository , ICandidateRepository candidateRepository) {
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
    }
    @Transactional
    public void updateProfile(String email , UpdateCandidateProfileDTO updateCandidateProfileDTO) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        CandidateProfile profile = user.getCandidateProfile();
        if(profile == null) {
            throw new RuntimeException("Hồ sơ ứng viên không tồn tại trong hệ thông");
        }
        profile.setFullName(updateCandidateProfileDTO.getFullName());
        profile.setPhone(updateCandidateProfileDTO.getPhone());
        profile.setAvatarUrl(updateCandidateProfileDTO.getAvatarUrl());
        profile.setDob(updateCandidateProfileDTO.getDob());
        profile.setGender(updateCandidateProfileDTO.getGender());
        profile.setAddress(updateCandidateProfileDTO.getAddress());
        profile.setBio(updateCandidateProfileDTO.getBio());
        profile.setCurrentPosition(updateCandidateProfileDTO.getCurrentPosition());
        profile.setExperienceYears(updateCandidateProfileDTO.getExperienceYears());
        profile.setExpectedSalary(updateCandidateProfileDTO.getExpectedSalary());
        profile.setLinkedinUrl(updateCandidateProfileDTO.getLinkedinUrl());
        profile.setGithubUrl(updateCandidateProfileDTO.getGithubUrl());
        profile.setPortfolioUrl(updateCandidateProfileDTO.getPortfolioUrl());
        candidateRepository.save(profile);
    }
}
