package com.example.ai_requirement_be.service.Job;

import com.example.ai_requirement_be.dto.Job.JobviewResponseDTO;
import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import com.example.ai_requirement_be.entity.Job.JobView;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.repository.IJobdepRepository;
import com.example.ai_requirement_be.repository.IJobviewRepository;
import com.example.ai_requirement_be.repository.IUserRepository;
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
public class JobViewServiceTest {

    @Mock
    private IJobviewRepository jobviewRepository;

    @Mock
    private IJobdepRepository jobdepRepository;

    @Mock
    private IUserRepository userRepository;

    @InjectMocks
    private JobViewService jobViewService;

    private JobDescription jobDescription;
    private User user;
    private Companies company;

    @BeforeEach
    void setUp() {
        company = new Companies();
        company.setName("Tech Corp");
        company.setLogoUrl("logo.png");

        jobDescription = new JobDescription();
        jobDescription.setId(1L);
        jobDescription.setTitle("Software Engineer");
        jobDescription.setCompany(company);

        user = new User();
        user.setId(1L);
        user.setEmail("test@gmail.com");
    }

    @Test
    void getJobDetailsAndRecordView_Success_WithUser() {
        when(jobdepRepository.findById(1L)).thenReturn(Optional.of(jobDescription));
        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(user));

        JobviewResponseDTO response = jobViewService.getJobDetailsAndRecordView(1L, "test@gmail.com");

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Software Engineer", response.getTitle());
        assertEquals("Tech Corp", response.getCompanyName());
        verify(jobviewRepository, times(1)).save(any(JobView.class));
    }

    @Test
    void getJobDetailsAndRecordView_Success_WithoutUser() {
        when(jobdepRepository.findById(1L)).thenReturn(Optional.of(jobDescription));

        JobviewResponseDTO response = jobViewService.getJobDetailsAndRecordView(1L, null);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        verify(jobviewRepository, never()).save(any(JobView.class));
    }

    @Test
    void getJobDetailsAndRecordView_JobNotFound() {
        when(jobdepRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            jobViewService.getJobDetailsAndRecordView(1L, "test@gmail.com");
        });

        assertEquals("Bài đăng tuyển dụng không tồn tại hoặc bị xóa!", exception.getMessage());
    }
}
