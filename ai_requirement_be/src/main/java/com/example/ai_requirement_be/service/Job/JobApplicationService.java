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

    public JobApplicationService(IJobApplicationRepository jobApplicationRepository, IJobdepRepository jobdepRepository, IUserRepository userRepository, ICandidateRepository candidateRepository, IResumeRepository resumeRepository, IRecruiterProfileRepository recruiterProfileRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobdepRepository = jobdepRepository;
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.resumeRepository = resumeRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
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
        responseDTO.setCandidateName(candidateProfile.getFullName());
        responseDTO.setResumeId(resume.getId());
        responseDTO.setResumeUrl(resume.getFileUrl());
        responseDTO.setStatus(savedApp.getStatus().name());
        responseDTO.setAppliedAt(savedApp.getAppliedAt());

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

        if (updatedApp.getCandidate() != null) {
            responseDTO.setCandidateId(updatedApp.getCandidate().getId());
            responseDTO.setCandidateName(updatedApp.getCandidate().getFullName());
            if(updatedApp.getCandidate().getUser() != null) {
                responseDTO.setCandidateEmail(updatedApp.getCandidate().getUser().getEmail());
            }
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
                dto.setCandidateName(app.getCandidate().getFullName());
                if (app.getCandidate().getUser() != null) {
                    dto.setCandidateEmail(app.getCandidate().getUser().getEmail());
                }
            }

            if (app.getResume() != null) {
                dto.setResumeId(app.getResume().getId());
                dto.setResumeUrl(app.getResume().getFileUrl());
            }

            dtoList.add(dto);
        }
        return dtoList;
    }

}
