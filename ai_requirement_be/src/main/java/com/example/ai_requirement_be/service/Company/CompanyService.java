package com.example.ai_requirement_be.service.Company;

import com.example.ai_requirement_be.dto.Company.UpdateCompanyDTO;
import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.repository.ICompanyRepository;
import com.example.ai_requirement_be.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {
  private final IUserRepository  userRepository;
  private final ICompanyRepository companyRepository;


 public CompanyService(IUserRepository userRepository , ICompanyRepository companyRepository) {
     this.userRepository = userRepository;
     this.companyRepository = companyRepository;
 }

 @Transactional
    public void updateCompanyProfile(String email , UpdateCompanyDTO updateCompanyDTO) {

     User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản doanh nghiệp!"));

     Companies companies = user.getCompanies();
     if(companies == null) {
         throw new RuntimeException("Hồ sơ doanh nghiệp không tồn tại trên hệ thống!");
     }
     companies.setName( updateCompanyDTO.getName());
     companies.setDescription( updateCompanyDTO.getDescription());
     companies.setIndustry(updateCompanyDTO.getIndustry());
     companies.setCompanySize(updateCompanyDTO.getCompanySize());
     companies.setWebsite(updateCompanyDTO.getWebsite());
     companies.setLogoUrl(updateCompanyDTO.getLogoUrl());
     companies.setLogoUrl(updateCompanyDTO.getLogoUrl());
     companies.setLocation(updateCompanyDTO.getLocation());
 }

}
