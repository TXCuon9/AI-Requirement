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
    public Resume getResumeById(Long resumeId, String candidateEmail) {
        CandidateProfile candidateProfile = getCandidateByEmail(candidateEmail);
        Resume resume = resumeRepository.findById(resumeId).orElseThrow(() -> new RuntimeException("Không tìm thấy CV yêu cầu!"));

        if(!resume.getCandidateId().getId().equals(candidateProfile.getId())){
            throw new RuntimeException("Bạn không có quyền xem CV của người khác!");
        }
        return resume;
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

    @Transactional
    public void setPrimaryResume(Long resumeId, String candidateEmail) {
        CandidateProfile candidateProfile = getCandidateByEmail(candidateEmail);
        Resume targetResume = resumeRepository.findById(resumeId).orElseThrow(() -> new RuntimeException("Không tìm thấy CV yêu cầu!"));

        if(!targetResume.getCandidateId().getId().equals(candidateProfile.getId())){
            throw new RuntimeException("Bạn không có quyền chỉnh sửa CV của người khác!");
        }

        List<Resume> allResumes = resumeRepository.findByCandidateIdOrderByCandidateIdAsc(candidateProfile);
        for (Resume resume : allResumes) {
            if (resume.getId().equals(resumeId)) {
                resume.setIsPrimary(true);
            } else {
                resume.setIsPrimary(false);
            }
        }
        resumeRepository.saveAll(allResumes);
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
        resume.setCvName(dto.getCvName());
        resume.setParsedText(dto.getParsedText());
        resume.setSummary(dto.getSummary());
        resume.setVersion(dto.getVersion());
        resume.setSkills(dto.getSkills());
        resume.setExperiences(dto.getExperienceItems());
        resume.setEducationItemDTOS(dto.getEducationItems());
        resume.setProjectItems(dto.getProjectItems());
        resume.setFullName(dto.getFullName());
        resume.setEmail(dto.getEmail());
        resume.setPhone(dto.getPhone());
        resume.setAddress(dto.getAddress());
        resume.setTargetPosition(dto.getTargetPosition());
        resume.setAvatarUrl(dto.getAvatarUrl());
        resume.setGithubUrl(dto.getGithubUrl());
        resume.setLinkedinUrl(dto.getLinkedinUrl());
        resume.setDob(dto.getDob());
        resume.setGender(dto.getGender());
        resume.setHobbies(dto.getHobbies());
    }
}
