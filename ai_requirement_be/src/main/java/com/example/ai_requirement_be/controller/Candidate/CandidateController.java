package com.example.ai_requirement_be.controller.Candidate;

import com.example.ai_requirement_be.dto.Candidate.UpdateCandidateProfileDTO;
import com.example.ai_requirement_be.service.Candidate.CandidateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {
    private final CandidateService candidateService;
    private final com.example.ai_requirement_be.service.Job.SavedJobService savedJobService;
    private final com.example.ai_requirement_be.service.Job.JobApplicationService jobApplicationService;

    @Autowired
    public CandidateController(CandidateService candidateService,
                               com.example.ai_requirement_be.service.Job.SavedJobService savedJobService,
                               com.example.ai_requirement_be.service.Job.JobApplicationService jobApplicationService) {
        this.candidateService = candidateService;
        this.savedJobService = savedJobService;
        this.jobApplicationService = jobApplicationService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        return ResponseEntity.ok(candidateService.getProfile(principal.getName()));
    }
    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(Principal principal , @Valid @RequestBody UpdateCandidateProfileDTO updateCandidateProfileDTO) {
        String currentEmail = principal.getName();
        candidateService.updateProfile(currentEmail, updateCandidateProfileDTO);
        return ResponseEntity.ok("Cập nhật thông tin hồ sơ thành công");
    }

    @PostMapping("/onboarding")
    public ResponseEntity<String> submitOnboarding(Principal principal, @RequestBody com.example.ai_requirement_be.dto.Candidate.OnboardingRequestDTO dto) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        candidateService.saveOnboarding(principal.getName(), dto);
        return ResponseEntity.ok("Lưu thông tin khảo sát thành công");
    }

    @GetMapping("/saved-jobs")
    public ResponseEntity<java.util.List<com.example.ai_requirement_be.dto.RecruiterDto.JobResponseDTO>> getSavedJobs(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(savedJobService.getSavedJobs(principal.getName()));
    }

    @GetMapping("/applied-jobs")
    public ResponseEntity<java.util.List<com.example.ai_requirement_be.dto.RecruiterDto.JobResponseDTO>> getAppliedJobs(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(jobApplicationService.getAppliedJobs(principal.getName()));
    }
}
