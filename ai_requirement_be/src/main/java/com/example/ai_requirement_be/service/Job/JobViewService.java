package com.example.ai_requirement_be.service.Job;

import com.example.ai_requirement_be.dto.Job.JobviewResponseDTO;
import com.example.ai_requirement_be.entity.Job.JobView;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.repository.IJobdepRepository;
import com.example.ai_requirement_be.repository.IJobviewRepository;
import com.example.ai_requirement_be.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class JobViewService {
    private final IJobviewRepository jobviewRepository;
    private final IJobdepRepository jobdepRepository;
    private final IUserRepository  userRepository;

    public JobViewService(IJobviewRepository jobviewRepository, IJobdepRepository jobdepRepository, IUserRepository userRepository) {
        this.jobviewRepository = jobviewRepository;
        this.jobdepRepository = jobdepRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public JobviewResponseDTO getJobDetailsAndRecordView(Long jobId , String email) {
        JobDescription jobDescription = jobdepRepository.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Bài đăng tuyển dụng không tồn tại hoặc bị xóa!"));

        if (email != null) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                JobView jobView = new JobView();
                jobView.setJobDescription(jobDescription);
                jobView.setUser(user);
                jobView.setViewedAt(LocalDateTime.now());
                jobviewRepository.save(jobView);
            }
        }

        // Trích xuất dữ liệu từ thực thể 'job' vừa tìm được để tạo JSON sạch
        JobviewResponseDTO jobviewResponseDTO = new JobviewResponseDTO();
        jobviewResponseDTO.setId(jobDescription.getId());
        if (jobDescription.getCompany() != null) {
            jobviewResponseDTO.setCompanyName(jobDescription.getCompany().getName());
        }
        jobviewResponseDTO.setTitle(jobDescription.getTitle());
        jobviewResponseDTO.setDescription(jobDescription.getDescription());
        jobviewResponseDTO.setRequirements(jobDescription.getRequirements());
        jobviewResponseDTO.setResponsibilities(jobDescription.getResponsibilities());
        jobviewResponseDTO.setLocation(jobDescription.getLocation());
        jobviewResponseDTO.setSalaryMax(jobDescription.getSalaryMax());
        jobviewResponseDTO.setSalaryMin(jobDescription.getSalaryMin());
        jobviewResponseDTO.setRemote(jobDescription.getRemote());
        jobviewResponseDTO.setJobType(jobDescription.getJobType() != null ? jobDescription.getJobType().name() : null);
        jobviewResponseDTO.setExperienceLevel(jobDescription.getExperienceLevel() != null ? jobDescription.getExperienceLevel().name() : null);

        return jobviewResponseDTO;
    }
}
