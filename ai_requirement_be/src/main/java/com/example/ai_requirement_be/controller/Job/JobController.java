package com.example.ai_requirement_be.controller.Job;

import com.example.ai_requirement_be.dto.RecruiterDto.JobResponseDTO;
import com.example.ai_requirement_be.service.Recruiter.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/job")
public class JobController {
    private final JobService jobService;
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }
    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponseDTO>> getAllJobs() {
        List<JobResponseDTO> list = jobService.getAllJobs();
        return ResponseEntity.ok(list);
    }
}
