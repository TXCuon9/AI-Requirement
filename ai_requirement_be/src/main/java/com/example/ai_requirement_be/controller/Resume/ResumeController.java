package com.example.ai_requirement_be.controller.Resume;

import com.example.ai_requirement_be.dto.Candidate.SaveResumeDTO;
import com.example.ai_requirement_be.entity.CandidateManager.Resume;
import com.example.ai_requirement_be.service.Candidate.ResumeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {
    private final ResumeService resumeService;
    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @GetMapping
    public ResponseEntity<List<Resume>> getMyResumes(Principal principal) {
        List<Resume> list = resumeService.getMyResumes(principal.getName());
        return ResponseEntity.ok(list);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResumeById(@PathVariable Long id, Principal principal) {
        Resume resume = resumeService.getResumeById(id, principal.getName());
        return ResponseEntity.ok(resume);
    }
    @PostMapping
    public ResponseEntity<String> CreateResume(Principal principal, @Valid @RequestBody SaveResumeDTO resumeDTO) {
        resumeService.createResume(resumeDTO, principal.getName());
        return ResponseEntity.ok("Tải lên và lưu CV thành công!");
    }
    @PutMapping("/{id}")
    public ResponseEntity<String> updateResume(@PathVariable Long id, Principal principal, @Valid @RequestBody SaveResumeDTO resumeDTO) {
        resumeService.updateResume(id , resumeDTO , principal.getName());
        return ResponseEntity.ok("Cập nhật thông tin CV thành công!");
    }
    
    @PutMapping("/{id}/ai-analysis")
    public ResponseEntity<String> updateAiAnalysisResult(@PathVariable Long id, Principal principal, @RequestBody java.util.Map<String, Object> aiResult) {
        resumeService.updateAiAnalysisResult(id, aiResult, principal.getName());
        return ResponseEntity.ok("Lưu kết quả phân tích AI thành công!");
    }

    @PatchMapping("/{id}/target-position")
    public ResponseEntity<String> updateTargetPosition(
            @PathVariable Long id,
            Principal principal,
            @RequestBody java.util.Map<String, String> request) {
        resumeService.updateTargetPosition(id, request.get("targetPosition"), principal.getName());
        return ResponseEntity.ok("Cập nhật vị trí mong muốn thành công!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResume(@PathVariable Long id, Principal principal) {
        resumeService.deleteResume(id , principal.getName());
        return ResponseEntity.ok("Xóa CV thành công!");
    }
    @PutMapping("/{id}/primary")
    public ResponseEntity<String> setPrimaryResume(@PathVariable Long id, Principal principal) {
        resumeService.setPrimaryResume(id, principal.getName());
        return ResponseEntity.ok("Đặt CV chính thành công!");
    }
}
