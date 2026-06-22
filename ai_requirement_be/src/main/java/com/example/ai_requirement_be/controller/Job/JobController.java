package com.example.ai_requirement_be.controller.Job;

import com.example.ai_requirement_be.dto.Job.JobApplicationRequestDTO;
import com.example.ai_requirement_be.dto.Job.JobApplicationResponseDTO;
import com.example.ai_requirement_be.dto.Job.JobviewResponseDTO;
import com.example.ai_requirement_be.dto.Job.SavedJobResponseDTO;
import com.example.ai_requirement_be.dto.RecruiterDto.JobResponseDTO;
import com.example.ai_requirement_be.dto.RecruiterDto.RecruiterCandidateManagementDTO;
import com.example.ai_requirement_be.entity.Job.JobApplication;
import com.example.ai_requirement_be.repository.IJobApplicationRepository;
import com.example.ai_requirement_be.service.Email.EmailService;
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
    private final IJobApplicationRepository  jobApplicationRepository;
    private final EmailService emailService;
    public JobController(JobService jobService , SavedJobService savedJobService ,  JobViewService jobViewService ,  JobApplicationService jobApplicationService , IJobApplicationRepository jobApplicationRepository ,  EmailService emailService) {
        this.jobService = jobService;
        this.savedJobService = savedJobService;
        this.jobViewService = jobViewService;
        this.jobApplicationService = jobApplicationService;
        this.jobApplicationRepository = jobApplicationRepository;
        this.emailService = emailService;
    }
    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponseDTO>> getAllJobs() {
        List<JobResponseDTO> list = jobService.getAllJobs();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/detail/{jobId}")
    public ResponseEntity<?> getJobDetail(@PathVariable Long jobId , Principal principal) {
        try {
            String email = principal != null ? principal.getName() : null;

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

            try {
                if(result.getCandidateEmail() != null) {
                    emailService.sendEmail(
                            result.getCandidateEmail(),
                            result.getCandidateName(),
                            result.getCompanyName()
                    );
                }

            }catch (Exception mailEx) {
                System.out.println("Nộp đơn thành công nhưng gửi mail xác nhận thất bại: " + mailEx.getMessage());
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @PutMapping("/interview/{applicationId}")
    public ResponseEntity<?> inviteToInterview(@PathVariable Long applicationId , Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Vui lòng đăng nhập tài khoản Nhà tuyển dụng!");
            }
            String recruiterEmail = principal.getName();
            JobApplicationResponseDTO result =
                    jobApplicationService.changeToInterviewStatus(applicationId, recruiterEmail);

            try {
                if (result.getCandidateEmail() != null) {
                    emailService.sendInterviewInvitationEmail(
                            result.getCandidateEmail(), 
                            result.getCandidateName(), 
                            result.getCompanyName(),
                            result.getJobTitle(),
                            result.getSalary(),
                            result.getContractDate(),
                            result.getStartDate()
                    );
                }
            } catch (Exception mailEx) {
                System.out.println(
                        "Cập nhật thành công nhưng gửi mail thất bại: "
                                + mailEx.getMessage()
                );
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Đã cập nhật trạng thái phỏng vấn nhưng gửi mail thất bại. Vui lòng kiểm tra lại cấu hình Email! Lỗi: " + mailEx.getMessage());
            }

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @PutMapping("/reject/{applicationId}")
    public ResponseEntity<?> rejectToInterview(@PathVariable Long applicationId , Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Vui lòng đăng nhập tài khoản");
            }
            String recruiterEmail = principal.getName();
            JobApplicationResponseDTO result =
                    jobApplicationService.changeToRejectedStatus(applicationId, recruiterEmail);
            try {
                if(result.getCandidateEmail() != null) {

                        emailService.sendInterviewRejectionEmail(result.getCandidateEmail() , result.getCandidateName() , result.getCompanyName());

                }
            } catch (Exception mailEx) {
                System.out.println(
                        "Cập nhật thành công nhưng gửi mail thất bại: "
                                + mailEx.getMessage()
                );
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Đã cập nhật trạng thái phỏng vấn nhưng gửi mail thất bại. Vui lòng kiểm tra lại cấu hình Email! Lỗi: " + mailEx.getMessage());
            }
            return ResponseEntity.ok(result);
        }    catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }catch (Exception e){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
    }
    }


    @GetMapping("/all")
    public ResponseEntity<?> getAllCandidateApplications(Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Vui lòng đăng nhập hệ thống!");
            }

            String recruiterEmail = principal.getName();

            // Lấy ra list danh sách thu gọn đặc biệt về Resume
            List<RecruiterCandidateManagementDTO> applicationList =
                    jobApplicationService.getJobApplications(recruiterEmail);

            return ResponseEntity.ok(applicationList);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}
