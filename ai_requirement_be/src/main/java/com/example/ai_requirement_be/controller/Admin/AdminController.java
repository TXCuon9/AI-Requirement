package com.example.ai_requirement_be.controller.Admin;

import com.example.ai_requirement_be.dto.Admin.CompanyAdminDTO;
import com.example.ai_requirement_be.dto.Admin.JobAdminDTO;
import com.example.ai_requirement_be.dto.Admin.UserAdminDTO;
import com.example.ai_requirement_be.dto.User.UserPendingResponseDTO;
import com.example.ai_requirement_be.service.Admin.AdminService;
import com.example.ai_requirement_be.service.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/user/pending")
    public List<UserPendingResponseDTO> getUser() {
        return userService.findAllPendingUsers();
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveCompany(@PathVariable Long id) {
        adminService.approveCompany(id);
        return ResponseEntity.ok("Đã duyệt tài khoản thành công sang trạng thái ACTIVE!");
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<com.example.ai_requirement_be.dto.Admin.AdminDashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats(jobRepository));
    }

    // --- USERS CRUD ---
    @GetMapping("/users")
    public ResponseEntity<List<UserAdminDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody UserAdminDTO dto) {
        adminService.updateUser(id, dto);
        return ResponseEntity.ok("Cập nhật người dùng thành công");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("Xóa người dùng thành công");
    }

    // --- COMPANIES CRUD ---
    @GetMapping("/companies")
    public ResponseEntity<List<CompanyAdminDTO>> getAllCompanies() {
        return ResponseEntity.ok(adminService.getAllCompanies());
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<String> updateCompany(@PathVariable Long id, @RequestBody CompanyAdminDTO dto) {
        adminService.updateCompany(id, dto);
        return ResponseEntity.ok("Cập nhật công ty thành công");
    }

    @PutMapping("/companies/{id}/toggle-status")
    public ResponseEntity<String> toggleCompanyStatus(@PathVariable Long id) {
        adminService.toggleCompanyStatus(id);
        return ResponseEntity.ok("Đã cập nhật trạng thái hoạt động của công ty");
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<String> deleteCompany(@PathVariable Long id) {
        adminService.deleteCompany(id);
        return ResponseEntity.ok("Xóa công ty thành công");
    }

    // --- JOBS CRUD ---
    @GetMapping("/jobs")
    public ResponseEntity<List<JobAdminDTO>> getAllJobs() {
        return ResponseEntity.ok(adminService.getAllJobs());
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<String> updateJob(@PathVariable Long id, @RequestBody JobAdminDTO dto) {
        adminService.updateJob(id, dto);
        return ResponseEntity.ok("Cập nhật việc làm thành công");
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id) {
        adminService.deleteJob(id);
        return ResponseEntity.ok("Xóa việc làm thành công");
    }
}
