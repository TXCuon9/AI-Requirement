package com.example.ai_requirement_be.service.Job;

import com.example.ai_requirement_be.dto.Job.SavedJobResponseDTO;
import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.Job.SaveJob;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.UserManager.UserRole;
import com.example.ai_requirement_be.repository.ICandidateRepository;
import com.example.ai_requirement_be.repository.IJobdepRepository;
import com.example.ai_requirement_be.repository.ISavedJobRepository;
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
public class SavedJobServiceTest {

    @Mock
    private ISavedJobRepository savedJobRepository;

    @Mock
    private IUserRepository userRepository;

    @Mock
    private ICandidateRepository candidateRepository;

    @Mock
    private IJobdepRepository jobdepRepository;

    @InjectMocks
    private SavedJobService savedJobService;

    private User user;
    private CandidateProfile candidateProfile;
    private JobDescription jobDescription;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("candidate@gmail.com");
        user.setRole(UserRole.CANDIDATE);

        candidateProfile = new CandidateProfile();
        candidateProfile.setId(1L);
        candidateProfile.setUser(user);

        jobDescription = new JobDescription();
        jobDescription.setId(1L);
        jobDescription.setTitle("Java Developer");
    }

    @Test
    void saveJobDTO_Success() {
        when(userRepository.findByEmail("candidate@gmail.com")).thenReturn(Optional.of(user));
        when(candidateRepository.findByUserId(1L)).thenReturn(Optional.of(candidateProfile));
        when(jobdepRepository.findById(1L)).thenReturn(Optional.of(jobDescription));
        when(savedJobRepository.existsByCandidateProfileIdAndJobDescriptionId(1L, 1L)).thenReturn(false);
        
        SaveJob saveJob = new SaveJob();
        saveJob.setId(1L);
        when(savedJobRepository.save(any(SaveJob.class))).thenReturn(saveJob);

        SavedJobResponseDTO response = savedJobService.saveJobDTO(1L, "candidate@gmail.com");

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getJobId());
        assertEquals("Java Developer", response.getJobTitle());
    }

    @Test
    void saveJobDTO_UserNotFound() {
        when(userRepository.findByEmail("notfound@gmail.com")).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            savedJobService.saveJobDTO(1L, "notfound@gmail.com");
        });

        assertEquals("Không tìm thấy tài khoản người dùng", exception.getMessage());
    }

    @Test
    void saveJobDTO_NotCandidateRole() {
        user.setRole(UserRole.RECRUITER);
        when(userRepository.findByEmail("candidate@gmail.com")).thenReturn(Optional.of(user));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            savedJobService.saveJobDTO(1L, "candidate@gmail.com");
        });

        assertEquals("Từ chối thao tác! Bạn không phải tải khoản Ưng viên", exception.getMessage());
    }

    @Test
    void saveJobDTO_CandidateProfileNotFound() {
        when(userRepository.findByEmail("candidate@gmail.com")).thenReturn(Optional.of(user));
        when(candidateRepository.findByUserId(1L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            savedJobService.saveJobDTO(1L, "candidate@gmail.com");
        });

        assertEquals("Hồ sơ ứng viên của bạn chưa được khởi tạo!", exception.getMessage());
    }

    @Test
    void saveJobDTO_JobNotFound() {
        when(userRepository.findByEmail("candidate@gmail.com")).thenReturn(Optional.of(user));
        when(candidateRepository.findByUserId(1L)).thenReturn(Optional.of(candidateProfile));
        when(jobdepRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            savedJobService.saveJobDTO(1L, "candidate@gmail.com");
        });

        assertEquals("Bài đăng tuyển dụng không tồn tại hoặc đã bị xóa", exception.getMessage());
    }

    @Test
    void saveJobDTO_AlreadySaved() {
        when(userRepository.findByEmail("candidate@gmail.com")).thenReturn(Optional.of(user));
        when(candidateRepository.findByUserId(1L)).thenReturn(Optional.of(candidateProfile));
        when(jobdepRepository.findById(1L)).thenReturn(Optional.of(jobDescription));
        when(savedJobRepository.existsByCandidateProfileIdAndJobDescriptionId(1L, 1L)).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            savedJobService.saveJobDTO(1L, "candidate@gmail.com");
        });

        assertEquals("Bạn đã lưu bài đăng tuyển dụng trước đó rồi", exception.getMessage());
    }
}
