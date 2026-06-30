package com.example.ai_requirement_be.service.Job;

import com.example.ai_requirement_be.dto.Job.JobApplicationRequestDTO;
import com.example.ai_requirement_be.dto.Job.JobApplicationResponseDTO;
import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.CandidateManager.Resume;
import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import com.example.ai_requirement_be.entity.Job.JobApplication;
import com.example.ai_requirement_be.entity.Job.JobApplicationStatusEnum;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.RecruiterManager.RecruiterProfile;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobApplicationServiceTest {

    @Mock
    private IJobApplicationRepository jobApplicationRepository;
    @Mock
    private IJobdepRepository jobdepRepository;
    @Mock
    private IUserRepository userRepository;
    @Mock
    private ICandidateRepository candidateRepository;
    @Mock
    private IResumeRepository resumeRepository;
    @Mock
    private IRecruiterProfileRepository recruiterProfileRepository;

    @InjectMocks
    private JobApplicationService jobApplicationService;

    private User user;
    private CandidateProfile candidateProfile;
    private JobDescription jobDescription;
    private Resume resume;
    private Companies company;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@gmail.com");

        candidateProfile = new CandidateProfile();
        candidateProfile.setId(1L);
        candidateProfile.setFullName("John Doe");

        company = new Companies();
        company.setId(1L);
        company.setName("Tech Corp");

        jobDescription = new JobDescription();
        jobDescription.setId(1L);
        jobDescription.setCompany(company);

        resume = new Resume();
        resume.setId(1L);
        resume.setCandidateId(candidateProfile);
        resume.setFileUrl("resume.pdf");
    }

    @Test
    void applyJob_Success() {
        JobApplicationRequestDTO requestDTO = new JobApplicationRequestDTO();
        requestDTO.setResumeId(1L);

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(user));
        when(candidateRepository.findByUserId(1L)).thenReturn(Optional.of(candidateProfile));
        when(jobdepRepository.findById(1L)).thenReturn(Optional.of(jobDescription));
        when(resumeRepository.findById(1L)).thenReturn(Optional.of(resume));
        when(jobApplicationRepository.existsByCandidateIdAndJobDescriptionId(1L, 1L)).thenReturn(false);

        JobApplication savedApp = new JobApplication();
        savedApp.setId(1L);
        savedApp.setStatus(JobApplicationStatusEnum.APPLIED);
        when(jobApplicationRepository.save(any(JobApplication.class))).thenReturn(savedApp);

        JobApplicationResponseDTO response = jobApplicationService.applyJob(1L, requestDTO, "test@gmail.com");

        assertNotNull(response);
        assertEquals(1L, response.getApplicationId());
        assertEquals("APPLIED", response.getStatus());
    }
    
    @Test
    void applyJob_UserNotFound() {
        JobApplicationRequestDTO requestDTO = new JobApplicationRequestDTO();
        requestDTO.setResumeId(1L);
        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            jobApplicationService.applyJob(1L, requestDTO, "test@gmail.com");
        });

        assertEquals("Không tìm thấy tài khoản người dùng!", exception.getMessage());
    }

    @Test
    void changeToInterviewStatus_Success() {
        RecruiterProfile recruiterProfile = new RecruiterProfile();
        recruiterProfile.setCompany(company);

        when(userRepository.findByEmail("hr@gmail.com")).thenReturn(Optional.of(user));
        when(recruiterProfileRepository.findByUserId(1L)).thenReturn(Optional.of(recruiterProfile));

        JobApplication jobApplication = new JobApplication();
        jobApplication.setId(1L);
        jobApplication.setJobDescription(jobDescription);
        jobApplication.setStatus(JobApplicationStatusEnum.APPLIED);

        when(jobApplicationRepository.findById(1L)).thenReturn(Optional.of(jobApplication));
        when(jobApplicationRepository.save(any(JobApplication.class))).thenReturn(jobApplication);

        JobApplicationResponseDTO response = jobApplicationService.changeToInterviewStatus(1L, "hr@gmail.com");

        assertNotNull(response);
        assertEquals("INTERVIEW", response.getStatus());
    }

    @Test
    void changeToRejectedStatus_Success() {
        RecruiterProfile recruiterProfile = new RecruiterProfile();
        recruiterProfile.setCompany(company);

        when(userRepository.findByEmail("hr@gmail.com")).thenReturn(Optional.of(user));
        when(recruiterProfileRepository.findByUserId(1L)).thenReturn(Optional.of(recruiterProfile));

        JobApplication jobApplication = new JobApplication();
        jobApplication.setId(1L);
        jobApplication.setJobDescription(jobDescription);
        jobApplication.setStatus(JobApplicationStatusEnum.APPLIED);

        when(jobApplicationRepository.findById(1L)).thenReturn(Optional.of(jobApplication));
        when(jobApplicationRepository.save(any(JobApplication.class))).thenReturn(jobApplication);

        JobApplicationResponseDTO response = jobApplicationService.changeToRejectedStatus(1L, "hr@gmail.com");

        assertNotNull(response);
        assertEquals("REJECTED", response.getStatus());
    }
}
