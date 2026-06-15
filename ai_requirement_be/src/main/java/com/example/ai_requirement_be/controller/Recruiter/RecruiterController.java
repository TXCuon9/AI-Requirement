package com.example.ai_requirement_be.controller.Recruiter;

import com.example.ai_requirement_be.dto.RecruiterDto.JobResponseDTO;
import com.example.ai_requirement_be.dto.RecruiterDto.SaveJobDTO;
import com.example.ai_requirement_be.service.Job.JobApplicationService;
import com.example.ai_requirement_be.service.Recruiter.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {
     private final JobService jobService;
     private final JobApplicationService jobApplicationService;
     public RecruiterController(JobService jobService, JobApplicationService jobApplicationService) {
         this.jobService = jobService;
         this.jobApplicationService = jobApplicationService;
     }
     @GetMapping("/jobs")
     public ResponseEntity<List<JobResponseDTO>> getMyJobs(Principal principal) {
         return ResponseEntity.ok(jobService.getJobsByRecruiterEmail(principal.getName()));
     }
     @PostMapping("/create")
    public ResponseEntity<String> createJob(Principal principal , @Valid @RequestBody SaveJobDTO saveJobDTO) {
         jobService.createJob(saveJobDTO , principal.getName());
         return ResponseEntity.ok("Đăng tin tuyển dụng thành công!");
         // principal.getName() lấy ra email từ token
     }
     @PutMapping("/{id}")
    public ResponseEntity<String> updateJob(@PathVariable Long id, Principal principal, @Valid @RequestBody SaveJobDTO dto) {
         jobService.updateJob(id, dto, principal.getName());
         return ResponseEntity.ok("Cập nhật tin tuyển dụng thành công!");
     }
     @DeleteMapping("/{id}")
     public ResponseEntity<String> deleteJob(@PathVariable Long id, Principal principal) {
         jobService.deleteJob(id, principal.getName());
         return ResponseEntity.ok("Xóa tin tuyển dụng thành công!");
     }
     @GetMapping("/{id}")
     public ResponseEntity<JobResponseDTO> getJobById(@PathVariable Long id, Principal principal) {
         return ResponseEntity.ok(jobService.getJobById(id, principal.getName()));
     }

     @GetMapping("/resume/{resumeId}")
     public ResponseEntity<?> getCandidateResume(@PathVariable Long resumeId, Principal principal) {
         try {
             if (principal == null) return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
             return ResponseEntity.ok(jobApplicationService.getCandidateResumeForRecruiter(resumeId, principal.getName()));
         } catch (IllegalArgumentException e) {
             return ResponseEntity.status(400).body(e.getMessage());
         } catch (Exception e) {
             return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
         }
     }
}
