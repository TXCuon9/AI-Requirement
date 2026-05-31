package com.example.ai_requirement_be.service.Candidate;

import com.example.ai_requirement_be.dto.Candidate.SaveResumeDTO;
import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.CandidateManager.Resume;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.repository.IResumeRepository;
import com.example.ai_requirement_be.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResumeService {
    private final IUserRepository userRepository;
    private final IResumeRepository resumeRepository;

    public ResumeService(IUserRepository userRepository, IResumeRepository resumeRepository) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
    }

    @Transactional
    public List<Resume> getMyResumes(String candidateEmail) {
        CandidateProfile candidate = getCandidateByEmail(candidateEmail);
        return resumeRepository.findByCandidateIdOrderByCandidateIdAsc(candidate);
    }

    @Transactional
    public void createResume(SaveResumeDTO dto , String candidateEmail){
        CandidateProfile candidate = getCandidateByEmail(candidateEmail);
        Resume resume = new Resume();
        resume.setCandidateId(candidate);
        mapDtoToEntity(dto, resume);
        resumeRepository.save(resume);
    }

    @Transactional
    public void updateResume(Long resumeId , SaveResumeDTO dto , String candidateEmail) {
        CandidateProfile candidateProfile = getCandidateByEmail(candidateEmail);

        Resume resume = resumeRepository.findById(resumeId).orElseThrow(() -> new RuntimeException("Không tìm thấy CV yêu cầu !"));

        if(!resume.getCandidateId().getId().equals(candidateProfile.getId())){
            throw new RuntimeException("Bạn không có quyền chỉnh sửa CV của người khác");
        }
        mapDtoToEntity(dto, resume);

    }

    @Transactional
    public void deleteResume(Long resumeId , String candidateEmail) {
       CandidateProfile candidateProfile = getCandidateByEmail(candidateEmail);

       Resume resume = resumeRepository.findById(resumeId).orElseThrow(() -> new RuntimeException("Không tìm thấy CV yêu cầu!"));

       // Kiểm tra quyền sở hữu CV trước khi xóa có khớp không
       if(!resume.getCandidateId().getId().equals(candidateProfile.getId())){
           throw new RuntimeException("Bạn không có quyền xóa CV của người khác!");
       }
        resumeRepository.delete(resume);
    }

    private CandidateProfile getCandidateByEmail(String candidateEmail) {
        User user = userRepository.findByEmail(candidateEmail).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản người dùng!"));

        // map 2 chiều xem là thằng candidate_profile đã có user_id chưa cấu hình chưa
        if(user.getCandidateProfile() == null){
            throw new RuntimeException("Tài khoản của bạn chưa cấu hình hồ sơ Ứng viên!");
        }
         // trả ra thằng Candidate Profile
        return user.getCandidateProfile();
    }

    private void mapDtoToEntity(SaveResumeDTO dto , Resume resume){
        resume.setFileUrl(dto.getFileUrl());
        resume.setParsedText(dto.getParsedText());
        resume.setSummary(dto.getSummary());
        resume.setVersion(dto.getVersion());
        resume.setSkills(dto.getSkills());
        resume.setExperiences(dto.getExperienceItems());
        resume.setEducationItemDTOS(dto.getEducationItems());
    }
}
