package com.example.ai_requirement_be.controller.Company;

import com.example.ai_requirement_be.dto.Company.UpdateCompanyDTO;
import com.example.ai_requirement_be.service.Company.CompanyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/company")
public class CompanyController {
   private final CompanyService companyService;
   public CompanyController(CompanyService companyService) {
       this.companyService = companyService;
   }
   @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(Principal principal , @Valid @RequestBody UpdateCompanyDTO updateCompanyDTO) {
       String email = principal.getName();
       companyService.updateCompanyProfile(email, updateCompanyDTO);
       return ResponseEntity.ok("Cập nhật hố sơ thành công");
   }
}
