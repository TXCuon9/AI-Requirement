package com.example.ai_requirement_be.controller.Admin;

import com.example.ai_requirement_be.service.Admin.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveCompany(@PathVariable Long id){
         adminService.approveCompany(id);
        return ResponseEntity.ok("Đã duyệt tài khoản thành công sang trạng thái ACTIVE!");
    }

}
