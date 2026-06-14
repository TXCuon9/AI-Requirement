package com.example.ai_requirement_be.service.Admin;

import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.UserManager.UserStatus;
import com.example.ai_requirement_be.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private final IUserRepository userRepository;

    @Autowired
    public AdminService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void approveCompany(Long userId) {

        User user =  userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản yêu cầu!"));
        if(user.getStatus() != UserStatus.PENDING) {
            throw new RuntimeException("Tài khoản này đã được kích hoạt hoặc không ở trạng thái chờ duyệt!");
        }

        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

    public com.example.ai_requirement_be.dto.Admin.AdminDashboardStatsDTO getDashboardStats(com.example.ai_requirement_be.repository.IJobdepRepository jobRepository) {
        long totalCompanies = userRepository.countByRole(com.example.ai_requirement_be.entity.UserManager.UserRole.COMPANY);
        long pendingCompanies = userRepository.countByRoleAndStatus(com.example.ai_requirement_be.entity.UserManager.UserRole.COMPANY, UserStatus.PENDING);
        long totalUsers = userRepository.count();
        long totalJobs = jobRepository.count();

        return new com.example.ai_requirement_be.dto.Admin.AdminDashboardStatsDTO(totalCompanies, pendingCompanies, totalUsers, totalJobs);
    }

    public java.util.List<com.example.ai_requirement_be.dto.Admin.CompanyAdminDTO> getAllCompanies() {
        java.util.List<User> companies = userRepository.findByRole(com.example.ai_requirement_be.entity.UserManager.UserRole.COMPANY);
        return companies.stream().map(user -> {
            com.example.ai_requirement_be.dto.Admin.CompanyAdminDTO dto = new com.example.ai_requirement_be.dto.Admin.CompanyAdminDTO();
            dto.setId(user.getId());
            dto.setEmail(user.getEmail());
            dto.setStatus(user.getStatus());
            if (user.getCompanies() != null) {
                dto.setName(user.getCompanies().getName());
                dto.setIndustry(user.getCompanies().getIndustry());
                dto.setCompanySize(user.getCompanies().getCompanySize());
                dto.setLocation(user.getCompanies().getLocation());
                dto.setVerified(user.getCompanies().getVerified());
            } else {
                dto.setName("Chưa cập nhật");
                dto.setVerified(false);
            }
            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }

    public void toggleCompanyStatus(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy công ty"));
        if (user.getStatus() == UserStatus.ACTIVE) {
            user.setStatus(UserStatus.INACTIVE);
        } else if (user.getStatus() == UserStatus.INACTIVE || user.getStatus() == UserStatus.PENDING) {
            user.setStatus(UserStatus.ACTIVE);
        }
        userRepository.save(user);
    }

}
