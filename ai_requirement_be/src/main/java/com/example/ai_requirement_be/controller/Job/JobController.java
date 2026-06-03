package com.example.ai_requirement_be.controller.Job;

import com.example.ai_requirement_be.dto.Job.SavedJobResponseDTO;
import com.example.ai_requirement_be.dto.RecruiterDto.JobResponseDTO;
import com.example.ai_requirement_be.service.Job.SavedJobService;
import com.example.ai_requirement_be.service.Recruiter.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class JobController {
    private final JobService jobService;
    private final SavedJobService savedJobService;
    public JobController(JobService jobService , SavedJobService savedJobService) {
        this.jobService = jobService;
        this.savedJobService = savedJobService;
    }
    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponseDTO>> getAllJobs() {
        List<JobResponseDTO> list = jobService.getAllJobs();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/saveJob/{jobId}")
    public ResponseEntity<?> handleSaveJob(@PathVariable Long jobId, Principal principal) {
        try {
            if(principal == null){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Vui lòng đăng nhập trước khi lưu bài!");
            }
            SavedJobResponseDTO savedJobResponseDTO = savedJobService.saveJobDTO(jobId, principal.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedJobResponseDTO);
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body( "Lỗi" + e.getMessage());
        }
    }

}
