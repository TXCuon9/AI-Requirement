package com.example.ai_requirement_be.service.Job;

import com.example.ai_requirement_be.dto.Job.JobApplicationRequestDTO;
import com.example.ai_requirement_be.dto.Job.JobApplicationResponseDTO;
import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.CandidateManager.Resume;
import com.example.ai_requirement_be.entity.Job.JobApplication;
import com.example.ai_requirement_be.entity.Job.JobApplicationStatusEnum;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class JobApplicationService {
    private final IJobApplicationRepository jobApplicationRepository;
    private final IJobdepRepository jobdepRepository;
    private final IUserRepository userRepository;
    private final ICandidateRepository candidateRepository;
    private final IResumeRepository resumeRepository;

    public JobApplicationService(  IJobApplicationRepository jobApplicationRepository, IJobdepRepository jobdepRepository, IUserRepository userRepository, ICandidateRepository candidateRepository, IResumeRepository resumeRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobdepRepository = jobdepRepository;
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.resumeRepository = resumeRepository;
    }
    @Transactional
    public JobApplicationResponseDTO applyJob(Long jobId , JobApplicationRequestDTO requestDTO , String candidateEmail) {
        User user = userRepository.findByEmail(candidateEmail).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản người dùng!"));

        CandidateProfile candidateProfile = candidateRepository.findByUserId(user.getId()).orElseThrow(() -> new IllegalArgumentException("Hồ sơ ứng viên của bạn chưa được khởi tạo!"));

        JobDescription jobDescription = jobdepRepository.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Bài đăng tuyển dụng không tồn tại hoặc đã đóng!"));

        Resume resume = resumeRepository.findById(requestDTO.getResumeId())
                .orElseThrow(() -> new IllegalArgumentException("Bản CV lựa chọn không tồn tại!"));

        if(!resume.getCandidateId().getId().equals(candidateProfile.getId())){
            throw new IllegalArgumentException("Thao tác gian lận! Bạn không thể sử dụng CV của người khác.");
        }

        if(jobApplicationRepository.existsByCandidateIdAndJobDescriptionId(candidateProfile.getId(),jobId)){
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
}
