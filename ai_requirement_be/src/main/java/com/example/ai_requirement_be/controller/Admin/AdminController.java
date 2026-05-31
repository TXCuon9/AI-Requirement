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
    @Autowired
    public AdminController(AdminService adminService , UserService userService) {

        this.adminService = adminService;
        this.userService = userService;
    }

    @RequestMapping("/user/pending")
    public List<UserPendingResponseDTO> getUser(){
       return userService.findAllPendingUsers();
    }
    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveCompany(@PathVariable Long id){
         adminService.approveCompany(id);
        return ResponseEntity.ok("Đã duyệt tài khoản thành công sang trạng thái ACTIVE!");
    }

}
