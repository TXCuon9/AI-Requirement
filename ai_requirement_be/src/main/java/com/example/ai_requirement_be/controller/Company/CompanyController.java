package com.example.ai_requirement_be.controller.Company;

import com.example.ai_requirement_be.dto.Company.CompanyResponseDTO;
import com.example.ai_requirement_be.dto.Company.CompanyDetailResponseDTO;
import com.example.ai_requirement_be.dto.Company.UpdateCompanyDTO;
import com.example.ai_requirement_be.dto.User.UserResponseDTO;
import com.example.ai_requirement_be.service.Company.CompanyService;
import com.example.ai_requirement_be.service.User.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/company")
public class CompanyController {
   private final CompanyService companyService;
   private final UserService userService;
   public CompanyController(CompanyService companyService , UserService userService) {
       this.companyService = companyService;
       this.userService = userService;
   }
    @GetMapping("/profile")
    public ResponseEntity<UpdateCompanyDTO> getProfile(Principal principal) {
        return ResponseEntity.ok(companyService.getCompanyProfile(principal.getName()));
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<com.example.ai_requirement_be.dto.Company.DashboardStatsDTO> getDashboardStats(Principal principal) {
        return ResponseEntity.ok(companyService.getDashboardStats(principal.getName()));
    }
   @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(Principal principal , @Valid @RequestBody UpdateCompanyDTO updateCompanyDTO) {
       String email = principal.getName();
       companyService.updateCompanyProfile(email, updateCompanyDTO);
       return ResponseEntity.ok("Cập nhật hố sơ thành công");
   }
   @GetMapping("/recruiter")
    public ResponseEntity<?> getRecruiterProfile(Principal principal) {
       try {
           if(principal == null) {
               return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập");
           }
           String email = principal.getName();
           List<UserResponseDTO> userResponseDTOS = userService.getRecruitersInSameCompany(email);
           return ResponseEntity.ok(userResponseDTOS);
       } catch (IllegalArgumentException e) {
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
       }catch (Exception e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
       }
   }
   @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveCompany(@PathVariable Long id) {
       companyService.approveRecruiter(id);
       return ResponseEntity.ok("Đã banned tài khoản trên tài khoản này không sử dụng được");
   }
    @GetMapping("/search")
    public ResponseEntity<?> searchCompanies(@RequestParam(value = "keyword", required = false) String keyword) {
        try {
            List<CompanyResponseDTO> results = companyService.searchCompanies(keyword);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống khi tìm kiếm công ty: " + e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable Long id) {
        try {
            CompanyDetailResponseDTO company = companyService.getCompanyById(id);
            return ResponseEntity.ok(company);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống khi lấy chi tiết công ty: " + e.getMessage());
        }
    }
}
