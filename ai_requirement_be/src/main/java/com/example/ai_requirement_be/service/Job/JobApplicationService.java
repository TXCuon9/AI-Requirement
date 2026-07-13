package com.example.ai_requirement_be.service.Job;

import com.example.ai_requirement_be.dto.Job.JobApplicationRequestDTO;
import com.example.ai_requirement_be.dto.Job.JobApplicationResponseDTO;
import com.example.ai_requirement_be.dto.RecruiterDto.RecruiterCandidateManagementDTO;
import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.CandidateManager.Resume;
import com.example.ai_requirement_be.entity.Job.JobApplication;
import com.example.ai_requirement_be.entity.Job.JobApplicationStatusEnum;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.RecruiterManager.RecruiterProfile;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.Job.JobFitCache;
import com.example.ai_requirement_be.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class JobApplicationService {
    private final IJobApplicationRepository jobApplicationRepository;
    private final IJobdepRepository jobdepRepository;
    private final IUserRepository userRepository;
    private final ICandidateRepository candidateRepository;
    private final IResumeRepository resumeRepository;
    private final IRecruiterProfileRepository recruiterProfileRepository;
    private final IJobFitCacheRepository jobFitCacheRepository;

    public JobApplicationService(IJobApplicationRepository jobApplicationRepository, IJobdepRepository jobdepRepository, IUserRepository userRepository, ICandidateRepository candidateRepository, IResumeRepository resumeRepository, IRecruiterProfileRepository recruiterProfileRepository, IJobFitCacheRepository jobFitCacheRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobdepRepository = jobdepRepository;
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.resumeRepository = resumeRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.jobFitCacheRepository = jobFitCacheRepository;
    }

    // Apply Cv
    @Transactional
    public JobApplicationResponseDTO applyJob(Long jobId, JobApplicationRequestDTO requestDTO, String candidateEmail) {
        User user = userRepository.findByEmail(candidateEmail).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản người dùng!"));

        CandidateProfile candidateProfile = candidateRepository.findByUserId(user.getId()).orElseThrow(() -> new IllegalArgumentException("Hồ sơ ứng viên của bạn chưa được khởi tạo!"));

        JobDescription jobDescription = jobdepRepository.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Bài đăng tuyển dụng không tồn tại hoặc đã đóng!"));

        Resume resume = resumeRepository.findById(requestDTO.getResumeId())
                .orElseThrow(() -> new IllegalArgumentException("Bản CV lựa chọn không tồn tại!"));

        if (!resume.getCandidateId().getId().equals(candidateProfile.getId())) {
            throw new IllegalArgumentException("Thao tác gian lận! Bạn không thể sử dụng CV của người khác.");
        }

        if (jobApplicationRepository.existsByCandidateIdAndJobDescriptionId(candidateProfile.getId(), jobId)) {
            throw new IllegalArgumentException("Bạn đã nộp đơn ứng tuyển vào công việc này rồi! Vui lòng chờ phản hồi.");
        }

        JobApplication jobApplication = new JobApplication();
        jobApplication.setJobDescription(jobDescription);
        jobApplication.setCandidate(candidateProfile);
        jobApplication.setResume(resume);
        jobApplication.setStatus(JobApplicationStatusEnum.APPLIED);
        jobApplication.setAppliedAt(LocalDateTime.now());

        JobApplication savedApp = jobApplicationRepository.save(jobApplication);

        JobApplicationResponseDTO responseDTO = new JobApplicationResponseDTO();
        responseDTO.setApplicationId(savedApp.getId());
        responseDTO.setCandidateId(candidateProfile.getId());
        
        String name = null;
        if (resume != null) {
            name = resume.getFullName();
        }
        if (name == null || name.trim().isEmpty()) {
            name = candidateProfile.getFullName();
        }
        if (name == null || name.trim().isEmpty()) {
            if (candidateEmail != null && candidateEmail.contains("@")) {
                name = candidateEmail.substring(0, candidateEmail.indexOf("@"));
            } else {
                name = candidateEmail;
            }
        }
        responseDTO.setCandidateName(name);

        responseDTO.setResumeId(resume.getId());
        responseDTO.setResumeUrl(resume.getFileUrl());
        responseDTO.setStatus(savedApp.getStatus().name());
        responseDTO.setAppliedAt(savedApp.getAppliedAt());
        responseDTO.setCandidateEmail(candidateEmail);

        if(jobDescription.getCompany() != null) {
            responseDTO.setCompanyName(jobDescription.getCompany().getName());
        }
        return responseDTO;
    }

    // Duyệt và quản lí Cv của hr
    @Transactional
    public JobApplicationResponseDTO changeToInterviewStatus(Long applicationId, String recruiterEmail) {
        User currentUser = userRepository.findByEmail(recruiterEmail).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản Nhà tuyển dụng!"));

        RecruiterProfile recruiterProfile = recruiterProfileRepository.findByUserId(currentUser.getId()).orElseThrow(() -> new IllegalArgumentException("Hồ sơ nhà tuyển dụng của bạn chưa được khởi tạo!"));

        if (recruiterProfile.getCompany() == null) {
            throw new IllegalArgumentException("Tài khoản của bạn chưa liên kết với công ty nào để duyệt CV!");
        }

        Long recruiterCompanyId = recruiterProfile.getCompany().getId();

        JobApplication jobApplication = jobApplicationRepository.findById(applicationId).orElseThrow(() -> new IllegalArgumentException("Đơn ứng tuyển không tồn tại"));

        if (jobApplication.getJobDescription() == null || jobApplication.getJobDescription().getCompany() == null) {
            throw new IllegalArgumentException("Dữ liệu đơn tuyển dụng bị lỗi hệ thống (Không tìm thấy công ty sở hữu bài đăng)!");
        }
        Long jobCompanyId = jobApplication.getJobDescription().getCompany().getId();

        if (!recruiterProfile.getCompany().getId().equals(jobCompanyId)) {
            throw new IllegalArgumentException("Từ chối thao tác! Bạn không có quyền mời phỏng vấn hồ sơ nộp vào công ty khác.");
        }


        if (jobApplication.getStatus() == JobApplicationStatusEnum.INTERVIEW) {
            throw new IllegalArgumentException("Đơn ứng tuyển này đã ở trạng thái phỏng vấn! Không thể thao tác thêm.");
        }
        if (jobApplication.getStatus() == JobApplicationStatusEnum.REJECTED) {
            throw new IllegalArgumentException("Khong the moi phong van vi don ung tuyen nay da bi tu choi truoc do!");
        }


        jobApplication.setStatus(JobApplicationStatusEnum.INTERVIEW);

        JobApplication updatedApp = jobApplicationRepository.save(jobApplication);

        JobApplicationResponseDTO responseDTO = new JobApplicationResponseDTO();
        responseDTO.setApplicationId(updatedApp.getId());
        responseDTO.setStatus(updatedApp.getStatus().name()); // Sẽ hiển thị là "INTERVIEW"
        responseDTO.setAppliedAt(updatedApp.getAppliedAt());
        responseDTO.setJobTitle(updatedApp.getJobDescription().getTitle());
        responseDTO.setSalary(updatedApp.getJobDescription().getSalaryMin().doubleValue());
        responseDTO.setContractDate(updatedApp.getJobDescription().getCreatedAt().toString());
        responseDTO.setStartDate(updatedApp.getJobDescription().getExpiredAt().toString());

        if (updatedApp.getCandidate() != null) {
            responseDTO.setCandidateId(updatedApp.getCandidate().getId());
            
            String name = null;
            if (updatedApp.getResume() != null) {
                name = updatedApp.getResume().getFullName();
            }
            if (name == null || name.trim().isEmpty()) {
                name = updatedApp.getCandidate().getFullName();
            }
            if ((name == null || name.trim().isEmpty()) && updatedApp.getCandidate().getUser() != null) {
                String email = updatedApp.getCandidate().getUser().getEmail();
                if(email != null && email.contains("@")) {
                    name = email.substring(0, email.indexOf("@"));
                } else {
                    name = email;
                }
            }
            responseDTO.setCandidateName(name);
            if(updatedApp.getCandidate().getUser() != null) {
                responseDTO.setCandidateEmail(updatedApp.getCandidate().getUser().getEmail());
            }
        }
        if (updatedApp.getJobDescription() != null && updatedApp.getJobDescription().getCompany() != null) {
            responseDTO.setCompanyName(updatedApp.getJobDescription().getCompany().getName());
        }
        if (updatedApp.getResume() != null) {
            responseDTO.setResumeId(updatedApp.getResume().getId());
            responseDTO.setResumeUrl(updatedApp.getResume().getFileUrl());
        }

        return responseDTO;
    }

    @Transactional
    public JobApplicationResponseDTO changeToRejectedStatus(Long applicationId, String recruiterEmail) {
        User currentUser = userRepository.findByEmail(recruiterEmail).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản Nhà tuyển dụng!"));
        RecruiterProfile recruiterProfile = recruiterProfileRepository.findByUserId(currentUser.getId()).orElseThrow(() -> new IllegalArgumentException("Hồ sơ nhà tuyển dụng của bạn chưa được khởi tạo!"));
        if (recruiterProfile.getCompany() == null) {
            throw new IllegalArgumentException("Tài khoản của bạn chưa liên kết với công ty nào để duyệt CV!");
        }
        Long recruiterCompanyId = recruiterProfile.getCompany().getId();
        JobApplication jobApplication = jobApplicationRepository.findById(applicationId).orElseThrow(() -> new IllegalArgumentException("Đơn ứng tuyển không tồn tại"));
        if (jobApplication.getJobDescription() == null || jobApplication.getJobDescription().getCompany() == null) {
            throw new IllegalArgumentException("Dữ liệu đơn tuyển dụng bị lỗi hệ thống (Không tìm thấy công ty sở hữu bài đăng)!");
        }
        Long jobCompanyId = jobApplication.getJobDescription().getCompany().getId();

        if (!recruiterProfile.getCompany().getId().equals(jobCompanyId)) {
            throw new IllegalArgumentException("Từ chối thao tác! Bạn không có quyền từ chối hồ sơ nộp vào công ty khác.");
        }
        if (jobApplication.getStatus() == JobApplicationStatusEnum.REJECTED) {
            throw new IllegalArgumentException("Đơn ứng tuyển này đã ở trạng thái từ chối! Không thể thao tác thêm.");
        }
        if (jobApplication.getStatus() == JobApplicationStatusEnum.INTERVIEW) {
            throw new IllegalArgumentException("Không thể từ chối vì đơn ứng tuyển này đã được mời phỏng vấn trước đó!");
        }
        jobApplication.setStatus(JobApplicationStatusEnum.REJECTED);
        JobApplication updatedApp = jobApplicationRepository.save(jobApplication);

        JobApplicationResponseDTO responseDTO = new JobApplicationResponseDTO();
        responseDTO.setApplicationId(updatedApp.getId());
        responseDTO.setStatus(updatedApp.getStatus().name()); // Sẽ hiển thị là "REJECTED"
        responseDTO.setAppliedAt(updatedApp.getAppliedAt());
        if (updatedApp.getCandidate() != null) {
            responseDTO.setCandidateId(updatedApp.getCandidate().getId());
            
            String name = null;
            if (updatedApp.getResume() != null) {
                name = updatedApp.getResume().getFullName();
            }
            if (name == null || name.trim().isEmpty()) {
                name = updatedApp.getCandidate().getFullName();
            }
            if ((name == null || name.trim().isEmpty()) && updatedApp.getCandidate().getUser() != null) {
                String email = updatedApp.getCandidate().getUser().getEmail();
                if(email != null && email.contains("@")) {
                    name = email.substring(0, email.indexOf("@"));
                } else {
                    name = email;
                }
            }
            responseDTO.setCandidateName(name);
            if(updatedApp.getCandidate().getUser() != null) {
                responseDTO.setCandidateEmail(updatedApp.getCandidate().getUser().getEmail());
            }
        }
        if (updatedApp.getJobDescription() != null && updatedApp.getJobDescription().getCompany() != null) {
            responseDTO.setCompanyName(updatedApp.getJobDescription().getCompany().getName());
        }
        if (updatedApp.getResume() != null) {
            responseDTO.setResumeId(updatedApp.getResume().getId());
            responseDTO.setResumeUrl(updatedApp.getResume().getFileUrl());
        }
        return responseDTO;
    }

    // Xem CV của các ứng viên đã apply
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<RecruiterCandidateManagementDTO> getJobApplications(String recruiterEmail) {
        User currentUser = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản Nhà tuyển dụng!"));

        RecruiterProfile recruiterProfile = recruiterProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Hồ sơ nhà tuyển dụng của bạn chưa được khởi tạo!"));

        if (recruiterProfile.getCompany() == null) {
            throw new IllegalArgumentException("Tài khoản của bạn chưa được liên kết với bất kỳ công ty nào!");
        }
        Long recruiterCompanyId = recruiterProfile.getCompany().getId();

        List<JobApplication> applications = jobApplicationRepository.findAllApplicationsByCompanyId(recruiterCompanyId);

        List<RecruiterCandidateManagementDTO> dtoList = new ArrayList<>();

        for (JobApplication app : applications) {
            RecruiterCandidateManagementDTO dto = new RecruiterCandidateManagementDTO();
            dto.setApplicationId(app.getId());
            dto.setStatus(app.getStatus().name());
            dto.setAppliedAt(app.getAppliedAt());

            // Thông tin cơ bản Ứng viên
            if (app.getCandidate() != null) {
                dto.setCandidateId(app.getCandidate().getId());
                
                String name = null;
                if (app.getResume() != null) {
                    name = app.getResume().getFullName();
                }
                if (name == null || name.trim().isEmpty()) {
                    name = app.getCandidate().getFullName();
                }
                if ((name == null || name.trim().isEmpty()) && app.getCandidate().getUser() != null) {
                    String email = app.getCandidate().getUser().getEmail();
                    if(email != null && email.contains("@")) {
                        name = email.substring(0, email.indexOf("@"));
                    } else {
                        name = email;
                    }
                }
                dto.setCandidateName(name);

                if (app.getCandidate().getUser() != null) {
                    dto.setCandidateEmail(app.getCandidate().getUser().getEmail());
                }
            }

            if (app.getResume() != null) {
                dto.setResumeId(app.getResume().getId());
                dto.setResumeUrl(app.getResume().getFileUrl());
                dto.setResumeTitle(app.getResume().getCvName());
            }
            
            if (app.getJobDescription() != null) {
                dto.setJobId(app.getJobDescription().getId());
                
                if (app.getResume() != null) {
                    jobFitCacheRepository.findByResumeIdAndJobId(app.getResume().getId(), app.getJobDescription().getId())
                        .ifPresent(cache -> {
                            if (cache.getMatchResult() != null && cache.getMatchResult().containsKey("match_score")) {
                                Object score = cache.getMatchResult().get("match_score");
                                if (score instanceof Number) {
                                    dto.setMatchScore(((Number) score).intValue());
                                }
                            }
                        });
                }
            }

            dtoList.add(dto);
        }
        return dtoList;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Resume getCandidateResumeForRecruiter(Long resumeId, String recruiterEmail) {
        User currentUser = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản Nhà tuyển dụng!"));

        Long companyId;
        RecruiterProfile recruiterProfile = recruiterProfileRepository.findByUserId(currentUser.getId()).orElse(null);

        if (recruiterProfile != null && recruiterProfile.getCompany() != null) {
            companyId = recruiterProfile.getCompany().getId();
        } else if (currentUser.getCompanies() != null) {
            companyId = currentUser.getCompanies().getId();
        } else {
            throw new IllegalArgumentException("Người dùng chưa liên kết với công ty nào.");
        }

        boolean hasAccess = jobApplicationRepository.existsByResumeIdAndJobDescriptionCompanyId(resumeId, companyId);
        if (!hasAccess) {
            throw new IllegalArgumentException("Bạn không có quyền xem CV này!");
        }

        return resumeRepository.findById(resumeId).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy CV!"));
    }

    @Transactional
    public JobApplicationResponseDTO updateApplicationStatus(Long applicationId, String newStatus, String recruiterEmail) {
        User currentUser = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản Nhà tuyển dụng!"));

        Long companyId;
        RecruiterProfile recruiterProfile = recruiterProfileRepository.findByUserId(currentUser.getId()).orElse(null);

        if (recruiterProfile != null && recruiterProfile.getCompany() != null) {
            companyId = recruiterProfile.getCompany().getId();
        } else if (currentUser.getCompanies() != null) {
            companyId = currentUser.getCompanies().getId();
        } else {
            throw new IllegalArgumentException("Người dùng chưa liên kết với công ty nào.");
        }

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn ứng tuyển!"));

        if (!application.getJobDescription().getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Bạn không có quyền cập nhật đơn ứng tuyển này!");
        }

        try {
            JobApplicationStatusEnum statusEnum = JobApplicationStatusEnum.valueOf(newStatus.toUpperCase());
            application.setStatus(statusEnum);
            jobApplicationRepository.save(application);

            return new JobApplicationResponseDTO(
                    application.getId(),
                    application.getCandidate().getId(),
                    application.getCandidate().getFullName(),
                    application.getCandidate().getUser().getEmail(),
                    application.getResume().getId(),
                    application.getResume().getFileUrl(),
                    application.getStatus().name(),
                    application.getAppliedAt(),
                    application.getJobDescription().getCompany().getName(),
                    application.getJobDescription().getTitle(),
                    "Sẽ thông báo sau",
                    "Sẽ thông báo sau"
            );
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ!");
        }
    }
}
