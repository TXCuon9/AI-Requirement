package com.example.ai_requirement_be.service;

import com.example.ai_requirement_be.dto.RecruiterDto.JobResponseDTO;
import com.example.ai_requirement_be.dto.RecruiterDto.SaveJobDTO;
import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.RecruiterManager.RecruiterProfile;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.repository.IJobdepRepository;
import com.example.ai_requirement_be.repository.IUserRepository;
import com.example.ai_requirement_be.service.Recruiter.JobService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobServiceTest {

    @Mock
    private IJobdepRepository jobdepRepository;

    @Mock
    private IUserRepository userRepository;

    @InjectMocks
    private JobService jobService;

    private User user;
    private RecruiterProfile recruiterProfile;
    private Companies company;
    private JobDescription jobDescription;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jobService, "pythonApiUrl", "http://localhost:8000");

        company = new Companies();
        company.setId(1L);
        company.setName("Tech Corp");

        recruiterProfile = new RecruiterProfile();
        recruiterProfile.setId(1L);
        recruiterProfile.setCompany(company);

        user = new User();
        user.setId(1L);
        user.setEmail("hr@techcorp.com");
        user.setRecruiterProfile(recruiterProfile);

        jobDescription = new JobDescription();
        jobDescription.setId(1L);
        jobDescription.setTitle("Backend Engineer");
        jobDescription.setCompany(company);
    }

    @Test
    void getAllJobs_Success() {
        when(jobdepRepository.findAll()).thenReturn(Collections.singletonList(jobDescription));

        List<JobResponseDTO> response = jobService.getAllJobs();

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals("Backend Engineer", response.get(0).getTitle());
    }

    @Test
    void getJobsByRecruiterEmail_Success() {
        when(userRepository.findByEmail("hr@techcorp.com")).thenReturn(Optional.of(user));
        when(jobdepRepository.findByCompany_Id(1L)).thenReturn(Collections.singletonList(jobDescription));

        List<JobResponseDTO> response = jobService.getJobsByRecruiterEmail("hr@techcorp.com");

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals("Backend Engineer", response.get(0).getTitle());
    }

    @Test
    void createJob_Success() {
        SaveJobDTO saveJobDTO = new SaveJobDTO();
        saveJobDTO.setTitle("Frontend Engineer");

        when(userRepository.findByEmail("hr@techcorp.com")).thenReturn(Optional.of(user));
        
        JobDescription savedJob = new JobDescription();
        savedJob.setId(2L);
        savedJob.setTitle("Frontend Engineer");
        savedJob.setCompany(company);
        
        when(jobdepRepository.save(any(JobDescription.class))).thenReturn(savedJob);

        assertDoesNotThrow(() -> {
            jobService.createJob(saveJobDTO, "hr@techcorp.com");
        });
        
        verify(jobdepRepository, times(1)).save(any(JobDescription.class));
    }

    @Test
    void getJobById_Success() {
        when(userRepository.findByEmail("hr@techcorp.com")).thenReturn(Optional.of(user));
        when(jobdepRepository.findById(1L)).thenReturn(Optional.of(jobDescription));

        JobResponseDTO response = jobService.getJobById(1L, "hr@techcorp.com");

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Backend Engineer", response.getTitle());
    }
    
    @Test
    void getJobById_NotOwnCompany() {
        Companies otherCompany = new Companies();
        otherCompany.setId(2L);
        
        JobDescription otherJob = new JobDescription();
        otherJob.setId(2L);
        otherJob.setCompany(otherCompany);

        when(userRepository.findByEmail("hr@techcorp.com")).thenReturn(Optional.of(user));
        when(jobdepRepository.findById(2L)).thenReturn(Optional.of(otherJob));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            jobService.getJobById(2L, "hr@techcorp.com");
        });

        assertEquals("Bạn không có quyền xem bài viết của công ty khác!", exception.getMessage());
    }
}
