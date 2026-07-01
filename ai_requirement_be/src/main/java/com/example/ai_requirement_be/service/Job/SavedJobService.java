package com.example.ai_requirement_be.service.Job;

import com.example.ai_requirement_be.dto.Job.SavedJobResponseDTO;
import com.example.ai_requirement_be.dto.RecruiterDto.SaveJobDTO;
import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.Job.SaveJob;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.UserManager.UserRole;
import com.example.ai_requirement_be.repository.ICandidateRepository;
import com.example.ai_requirement_be.repository.IJobdepRepository;
import com.example.ai_requirement_be.repository.ISavedJobRepository;
import com.example.ai_requirement_be.repository.IUserRepository;
import com.example.ai_requirement_be.service.Recruiter.JobService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class SavedJobService {
   private  ISavedJobRepository savedJobRepository;
   private  IUserRepository userRepository;
   private  ICandidateRepository  candidateRepository;
   private  IJobdepRepository   jobdepRepository;

   @Autowired
    public SavedJobService(ISavedJobRepository savedJobRepository, IUserRepository userRepository, ICandidateRepository candidateRepository, IJobdepRepository jobdepRepository) {
        this.savedJobRepository = savedJobRepository;
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.jobdepRepository = jobdepRepository;
    }
   @Transactional
    public SavedJobResponseDTO saveJobDTO(Long jobId , String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản người dùng"));

        if(!UserRole.CANDIDATE.equals(user.getRole())){
            throw new IllegalArgumentException("Từ chối thao tác! Bạn không phải tải khoản Ưng viên");
        }
         // Lấy ra hồ sơ CandidateProfile tương ứng thông qua UserId
       CandidateProfile candidateProfile = candidateRepository.findByUserId(user.getId()).orElseThrow( () -> new IllegalArgumentException("Hồ sơ ứng viên của bạn chưa được khởi tạo!"));

        // Kiểm tra bài đăng công việc Job gừi lên xem có tồn tại thực tế không
       JobDescription job = jobdepRepository.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Bài đăng tuyển dụng không tồn tại hoặc đã bị xóa"));

       // Kiểm tra trùng lặp
       if(savedJobRepository.existsByCandidateProfileIdAndJobDescriptionId(candidateProfile.getId(), job.getId())){
              throw new IllegalArgumentException("Bạn đã lưu bài đăng tuyển dụng trước đó rồi");
       }
       // Tiến hành đóng gói Entity và lưu xuống Database
       SaveJob saveJob = new SaveJob();
       saveJob.setCandidateProfile(candidateProfile);
       saveJob.setJobDescription(job);
       // Lưu và hứng thực thể vừa lưu thành công (lúc này đã có ID sinh tự động và thời gian sinh tự động
       SaveJob savedRecord =  savedJobRepository.save(saveJob);

       SavedJobResponseDTO responseDTO = new SavedJobResponseDTO();
       responseDTO.setId(savedRecord.getId());
       responseDTO.setJobId(job.getId());
       responseDTO.setJobTitle(job.getTitle());
       responseDTO.setSavedAt(job.getCreatedAt());

       if(job.getCompany() != null) {
           responseDTO.setCompanyName(job.getCompany().getName());
       } else {
           responseDTO.setCompanyName("Công ty ẩn danh");
       }
       responseDTO.setSavedAt(savedRecord.getCreatedAt());

       return responseDTO;
   }
}
