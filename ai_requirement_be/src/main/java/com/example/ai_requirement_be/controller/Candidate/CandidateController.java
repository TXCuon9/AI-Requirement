package com.example.ai_requirement_be.controller.Candidate;

import com.example.ai_requirement_be.dto.Candidate.UpdateCandidateProfileDTO;
import com.example.ai_requirement_be.service.Candidate.CandidateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {
    private final CandidateService candidateService;
    @Autowired
    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
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
}
