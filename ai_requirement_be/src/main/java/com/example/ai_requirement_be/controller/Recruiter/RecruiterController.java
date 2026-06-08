package com.example.ai_requirement_be.controller.Recruiter;

import com.example.ai_requirement_be.dto.RecruiterDto.JobResponseDTO;
import com.example.ai_requirement_be.dto.RecruiterDto.SaveJobDTO;
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
     public RecruiterController(JobService jobService) {
         this.jobService = jobService;
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
         return ResponseEntity.ok("Cập nhật tin tuyển dụng thành công!");}
}
