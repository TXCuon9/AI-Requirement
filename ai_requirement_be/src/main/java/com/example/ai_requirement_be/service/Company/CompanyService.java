package com.example.ai_requirement_be.service.Company;

import com.example.ai_requirement_be.dto.Company.CompanyResponseDTO;
import com.example.ai_requirement_be.dto.Company.UpdateCompanyDTO;
import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.UserManager.UserRole;
import com.example.ai_requirement_be.entity.UserManager.UserStatus;
import com.example.ai_requirement_be.repository.ICompanyRepository;
import com.example.ai_requirement_be.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.ArrayList;
import java.util.List;

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
     companies.setLocation(updateCompanyDTO.getLocation());
 }

 public UpdateCompanyDTO getCompanyProfile(String email) {
     User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản doanh nghiệp!"));
     Companies companies = user.getCompanies();
     if(companies == null) {
         throw new RuntimeException("Hồ sơ doanh nghiệp không tồn tại trên hệ thống!");
     }
     UpdateCompanyDTO dto = new UpdateCompanyDTO();
     dto.setName(companies.getName());
     dto.setDescription(companies.getDescription());
     dto.setIndustry(companies.getIndustry());
     dto.setCompanySize(companies.getCompanySize());
     dto.setWebsite(companies.getWebsite());
     dto.setLogoUrl(companies.getLogoUrl());
     dto.setLocation(companies.getLocation());
     return dto;
 }
  public void approveRecruiter(Long userId) {
     User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản yêu cầu"));

     if(user.getRole() != UserRole.RECRUITER) {
         throw new RuntimeException("Tài khoản này không phải hr không thuộc kiểm soát của Company");
     }
     user.setStatus(UserStatus.BANNED);
     userRepository.save(user);
  }
   @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<CompanyResponseDTO> searchCompanies(String keyword) {
      List<Companies> companies;

      if(keyword == null || keyword.trim().isEmpty()) {
          companies = companyRepository.findAll();
      } else {
          companies = companyRepository.searchCompaniesByKeyword(keyword.trim());
      }

       List<CompanyResponseDTO> dtoList = new ArrayList<>();
       for (Companies comp : companies) {
           CompanyResponseDTO dto = new CompanyResponseDTO(
                   comp.getId(),
                   comp.getName(),
                   comp.getDescription(),
                   comp.getIndustry(),
                   comp.getCompanySize(),
                   comp.getWebsite(),
                   comp.getLogoUrl(),
                   comp.getLocation(),
                   comp.getVerified()
           );
           dtoList.add(dto);
       }
       return dtoList;
   }




}
