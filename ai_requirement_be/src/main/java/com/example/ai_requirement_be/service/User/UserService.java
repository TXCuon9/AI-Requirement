package com.example.ai_requirement_be.service.User;

import com.example.ai_requirement_be.dto.User.UserPendingResponseDTO;
import com.example.ai_requirement_be.dto.User.UserResponseDTO;
import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import com.example.ai_requirement_be.entity.RecruiterManager.RecruiterProfile;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.UserManager.UserRole;
import com.example.ai_requirement_be.entity.UserManager.UserStatus;
import com.example.ai_requirement_be.repository.ICompanyRepository;
import com.example.ai_requirement_be.repository.IRecruiterProfileRepository;
import com.example.ai_requirement_be.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final IUserRepository userRepository;
    private final ICompanyRepository companyRepository;
    @Autowired
    public  UserService(IUserRepository userRepository , ICompanyRepository companyRepository) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;

    }

    public List<UserPendingResponseDTO> findAllPendingUsers() {
       List<User> pendingUsers = userRepository.findByStatus(UserStatus.PENDING);

       return pendingUsers.stream().map(user -> new UserPendingResponseDTO(
               user.getId(),
               user.getEmail(),
               user.getRole(),
               user.getProvider(),
               user.getStatus(),
               user.getCreatedAt(),
               user.getUpdatedAt()
       )).collect(Collectors.toList());
    }
   @Transactional(readOnly = true)
    public List<UserResponseDTO> getRecruitersInSameCompany(String email) {
        //Tìm User đăng nhập (đóng vai trò là tài khoản đại diện công ty
        User currentUser = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoàn" + email));

        // Từ User này, tìm ra thực thể Company tương ứng trong DB
        Companies currentCompanies = companyRepository.findByUserId(currentUser.getId()).orElseThrow( () -> new IllegalArgumentException("Tài khoản chưa được liên kết với thông tin Công ty!"));

        // Tận dụng @OneToMany hai chiều để lấy toàn bộ HR thuộc công ty này
        List<RecruiterProfile> recruiterProfiles = currentCompanies.getRecruiterProfiles();



       // Tận dụng quan hệ song phương để lấy toàn bộ danh sách HR của công ty đó
       List<UserResponseDTO> dtoList = new ArrayList<>();

       for(RecruiterProfile recruiterProfile : recruiterProfiles){
           User hrUser = recruiterProfile.getUser(); // lấy thông tin tài khoản thằng hr
           if(hrUser != null) {
               if(hrUser.getStatus() != UserStatus.ACTIVE) { continue; }
              UserResponseDTO dto = new UserResponseDTO(
                      hrUser.getId(),
                      hrUser.getEmail(),
                      hrUser.getRole(),
                      hrUser.getStatus(),
                      hrUser.getCreatedAt(),
                      hrUser.getUpdatedAt()
              );
               dtoList.add(dto);
           }
       }
       return dtoList;
   }







}
