package com.example.ai_requirement_be.controller.Job;

import com.example.ai_requirement_be.dto.Job.JobApplicationRequestDTO;
import com.example.ai_requirement_be.dto.Job.JobApplicationResponseDTO;
import com.example.ai_requirement_be.dto.Job.JobviewResponseDTO;
import com.example.ai_requirement_be.dto.Job.SavedJobResponseDTO;
import com.example.ai_requirement_be.dto.RecruiterDto.JobResponseDTO;
import com.example.ai_requirement_be.service.Job.JobApplicationService;
import com.example.ai_requirement_be.service.Job.JobViewService;
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
    private final JobViewService jobViewService;
    private final JobApplicationService  jobApplicationService;
    public JobController(JobService jobService , SavedJobService savedJobService ,  JobViewService jobViewService ,  JobApplicationService jobApplicationService) {
        this.jobService = jobService;
        this.savedJobService = savedJobService;
        this.jobViewService = jobViewService;
        this.jobApplicationService = jobApplicationService;
    }
    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponseDTO>> getAllJobs() {
        List<JobResponseDTO> list = jobService.getAllJobs();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/detail/{jobId}")
    public ResponseEntity<?> getJobDetail(@PathVariable Long jobId , Principal principal) {
        try {
            if(principal == null) {
                return ResponseEntity.status(401).body("Vui lòng đăng nhập để xem chi tiết công việc!");
            }
            String email = principal.getName();

            JobviewResponseDTO jobviewResponseDTO = jobViewService.getJobDetailsAndRecordView(jobId ,email);
            return ResponseEntity.ok(jobviewResponseDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
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

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> applyToJob(@PathVariable Long jobId , @RequestBody JobApplicationRequestDTO requestDTO , Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Vui lòng đăng nhập để thực hiện nộp đơn tuyển dụng!");
            }
            String candidateEmail = principal.getName();
            JobApplicationResponseDTO result = jobApplicationService.applyJob(jobId, requestDTO, candidateEmail);

            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}
