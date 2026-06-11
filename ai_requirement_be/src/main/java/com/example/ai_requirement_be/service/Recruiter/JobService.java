package com.example.ai_requirement_be.service.Recruiter;

import com.example.ai_requirement_be.dto.RecruiterDto.JobResponseDTO;
import com.example.ai_requirement_be.dto.RecruiterDto.SaveJobDTO;
import com.example.ai_requirement_be.entity.CandidateManager.Resume;
import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import com.example.ai_requirement_be.entity.Job.JobApplication;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.repository.IJobApplicationRepository;
import com.example.ai_requirement_be.repository.IJobdepRepository;
import com.example.ai_requirement_be.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {
    private final IJobdepRepository jobdepRepository;
    private final IUserRepository userRepository;

    public JobService(IJobdepRepository jobdepRepository, IUserRepository userRepository) {
        this.jobdepRepository = jobdepRepository;
        this.userRepository = userRepository;
    }
    public List<JobResponseDTO> getAllJobs() {
        // 1. Lấy toàn bộ thực thể dưới DB lên
        List<JobDescription> jobs = jobdepRepository.findAll();

        return jobs.stream()
                .map(job -> new JobResponseDTO(job)) // hoặc dùng Method Reference: JobResponseDTO::new
                .toList();
    }

    public List<JobResponseDTO> getJobsByRecruiterEmail(String recruiterEmail) {
        Companies companies = getCompanyByRecruiterEmail(recruiterEmail);
        List<JobDescription> jobs = jobdepRepository.findByCompany_Id(companies.getId());
        
        return jobs.stream()
                .map(job -> new JobResponseDTO(job))
                .toList();
    }

    @Transactional
    public void createJob(SaveJobDTO saveJobDTO , String recruiterEmail) {
        Companies companies = getCompanyByRecruiterEmail(recruiterEmail);
        JobDescription jobDescription = new JobDescription();
        mapDtoToEntity(saveJobDTO, jobDescription);
        jobDescription.setCompany(companies);

        jobdepRepository.save(jobDescription);
    }

    @Transactional
    public void updateJob( Long jobId , SaveJobDTO saveJobDTO , String recruiterEmail) {
        Companies companies  = getCompanyByRecruiterEmail(recruiterEmail);
        JobDescription jobDescription = jobdepRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Không tìm thấy bài đăng tuyển dụng!"));

        if(!jobDescription.getCompany().getId().equals(companies.getId())) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa bài viết của công ty khác!");
        }

        mapDtoToEntity(saveJobDTO, jobDescription);
    }

    @Transactional
    public void deleteJob(Long jobId, String recruiterEmail) {
        Companies companies = getCompanyByRecruiterEmail(recruiterEmail);
        JobDescription jobDescription = jobdepRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Không tìm thấy bài đăng tuyển dụng!"));

        if(!jobDescription.getCompany().getId().equals(companies.getId())) {
            throw new RuntimeException("Bạn không có quyền xóa bài viết của công ty khác!");
        }

        jobdepRepository.delete(jobDescription);
    }

    public JobResponseDTO getJobById(Long jobId, String recruiterEmail) {
        Companies companies = getCompanyByRecruiterEmail(recruiterEmail);
        JobDescription jobDescription = jobdepRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Không tìm thấy bài đăng tuyển dụng!"));

        if(!jobDescription.getCompany().getId().equals(companies.getId())) {
            throw new RuntimeException("Bạn không có quyền xem bài viết của công ty khác!");
        }

        return new JobResponseDTO(jobDescription);
    }

    private Companies getCompanyByRecruiterEmail(String recruiterEmail) {
        // Tìm xem bên trong bảng user này có email này không
        User user = userRepository.findByEmail(recruiterEmail).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản ngưởi dùng"));

        // user.getRecruiterProfile -> lấy ra thằng recruiter_profile được nối one to one với bảng user
        // user.getRecruiterProfile.getCompany -> do thằng này hr được nối @Manyone với thằng company
        // nên ta có thể xác định rằng thằng Recruiter đã thuộc công ty nào chưa -> nếu chưa vứt ra ngoại lệ
        if(user.getRecruiterProfile() == null || user.getRecruiterProfile().getCompany() == null) {
            throw new RuntimeException("Tài khoản của bạn chưa được liên kết với bất kì công ty nào");
        }
        return user.getRecruiterProfile().getCompany();
    }


    private void mapDtoToEntity(SaveJobDTO dto, JobDescription job) {
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setRequirements(dto.getRequirement());
        job.setResponsibilities(dto.getResponsibilities());
        job.setSalaryMin(dto.getSalaryMin());
        job.setSalaryMax(dto.getSalaryMax());
        job.setLocation(dto.getLocation());
        job.setRemote(dto.getRemote());
        job.setJobType(dto.getJobType());
        job.setExperienceLevel(dto.getExperienceLevel());
        job.setExpiredAt(dto.getExpiredAt());
    }



}
