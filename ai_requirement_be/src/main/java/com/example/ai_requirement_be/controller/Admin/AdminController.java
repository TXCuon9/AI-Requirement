package com.example.ai_requirement_be.controller.Admin;

import com.example.ai_requirement_be.dto.User.UserPendingResponseDTO;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.service.Admin.AdminService;
import com.example.ai_requirement_be.service.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    private final UserService userService;
    private final com.example.ai_requirement_be.repository.IJobdepRepository jobRepository;

    @Autowired
    public AdminController(AdminService adminService, UserService userService,
            com.example.ai_requirement_be.repository.IJobdepRepository jobRepository) {

        this.adminService = adminService;
        this.userService = userService;
        this.jobRepository = jobRepository;
    }

    @RequestMapping("/user/pending")
    public List<UserPendingResponseDTO> getUser() {
        return userService.findAllPendingUsers();
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveCompany(@PathVariable Long id) {
        adminService.approveCompany(id);
        return ResponseEntity.ok("Đã duyệt tài khoản thành công sang trạng thái ACTIVE!");
    }

    @org.springframework.web.bind.annotation.GetMapping("/dashboard-stats")
    public ResponseEntity<com.example.ai_requirement_be.dto.Admin.AdminDashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats(jobRepository));
    }

    @org.springframework.web.bind.annotation.GetMapping("/companies")
    public ResponseEntity<List<com.example.ai_requirement_be.dto.Admin.CompanyAdminDTO>> getAllCompanies() {
        return ResponseEntity.ok(adminService.getAllCompanies());
    }

    @PutMapping("/companies/{id}/toggle-status")
    public ResponseEntity<String> toggleCompanyStatus(@PathVariable Long id) {
        adminService.toggleCompanyStatus(id);
        return ResponseEntity.ok("Đã cập nhật trạng thái hoạt động của công ty");
    }
}
