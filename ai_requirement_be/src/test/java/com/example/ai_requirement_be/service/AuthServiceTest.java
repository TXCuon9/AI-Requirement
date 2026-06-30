package com.example.ai_requirement_be.service;

import com.example.ai_requirement_be.dto.Auth.RegisterRequestDTO;
import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import com.example.ai_requirement_be.entity.RecruiterManager.RecruiterProfile;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.UserManager.UserRole;
import com.example.ai_requirement_be.entity.UserManager.UserStatus;
import com.example.ai_requirement_be.repository.IUserRepository;
import com.example.ai_requirement_be.service.Authendication.AuthService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private IUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private RegisterRequestDTO registerRequestDTO;

    @BeforeEach
    void setUp() {
        registerRequestDTO = new RegisterRequestDTO();
        registerRequestDTO.setEmail("test@gmail.com");
        registerRequestDTO.setPassword("rawPassword123");
    }
    @Test
    @DisplayName("Đăng ký thành công : Tạo mới User và gán mặc định role CANDIDATE")
    void register_Sucess() {
        Mockito.when(userRepository.existsByEmail(registerRequestDTO.getEmail())).thenReturn(false);
        Mockito.when(passwordEncoder.encode(registerRequestDTO.getPassword())).thenReturn("hashedPasswordXYZ");

        String result = authService.register(registerRequestDTO);

        Assertions.assertEquals("Đăng ký tài khoản thành công", result);

        // userRepository.save(user) => để bắt thằng này
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        Mockito.verify(userRepository , Mockito.times(1)).save(captor.capture());

        User saveUser = captor.getValue();

        Assertions.assertEquals("test@gmail.com", saveUser.getEmail());
        Assertions.assertEquals("hashedPasswordXYZ", saveUser.getPassword());

        Assertions.assertEquals(UserRole.CANDIDATE, saveUser.getRole());
        Assertions.assertNotNull(saveUser.getCandidateProfile()); // xem thằng candidate được tạo chưa
    }
    @Test
    @DisplayName("Đăng ký thành công : Tạo tài khoản cho role Company")
    void register_Sucess_Company() {
        Mockito.when(userRepository.existsByEmail(registerRequestDTO.getEmail())).thenReturn(false);
        Mockito.when(passwordEncoder.encode(registerRequestDTO.getPassword())).thenReturn("hashedPasswordXYZ");
        String result = authService.registerCompany(registerRequestDTO);

        Assertions.assertEquals("Vui lòng đợi Admin duyệt mới có thể đăng nhập", result);
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        Mockito.verify(userRepository , Mockito.times(1)).save(captor.capture());

        User saveUser = captor.getValue();

        Assertions.assertEquals("test@gmail.com" , saveUser.getEmail());
        Assertions.assertEquals("hashedPasswordXYZ", saveUser.getPassword());

        Assertions.assertEquals(UserRole.COMPANY, saveUser.getRole());
        Assertions.assertEquals(UserStatus.PENDING , saveUser.getStatus());
        Assertions.assertNotNull(saveUser.getCompanies());
    }
    @Test
    @DisplayName("Đăng ký Recruiter thành công : Khởi tạo Hr và liên kết đúng Công ty")
    void reregisterRecruiter_Success() {
        String companyEmail = "admin@company.com";

        Companies mockCompany = new Companies();
        mockCompany.setName("FPT SOFTWARE");

        User mockCompanyUser = new User();
        mockCompanyUser.setEmail(companyEmail);
        mockCompanyUser.setCompanies(mockCompany);

        Mockito.when(userRepository.existsByEmail(registerRequestDTO.getEmail())).thenReturn(false);
        Mockito.when(userRepository.findByEmail(companyEmail)).thenReturn(Optional.of(mockCompanyUser));
        Mockito.when(passwordEncoder.encode(registerRequestDTO.getPassword())).thenReturn("hashedHRPassword");

        String result = authService.registerRecruiter(registerRequestDTO, companyEmail);

        Assertions.assertEquals("Bạn đã đăng ký tài khoản hr thành công", result);
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        Mockito.verify(userRepository, Mockito.times(1)).save(userCaptor.capture());

        User savedHrUser = userCaptor.getValue();

        Assertions.assertEquals(registerRequestDTO.getEmail(), savedHrUser.getEmail());
        Assertions.assertEquals("hashedHRPassword", savedHrUser.getPassword());
        Assertions.assertEquals(UserRole.RECRUITER, savedHrUser.getRole());

        RecruiterProfile savedProfile = savedHrUser.getRecruiterProfile();
        Assertions.assertNotNull(savedProfile);
        Assertions.assertEquals("HR Manager", savedProfile.getPosition());
        Assertions.assertEquals("FPT SOFTWARE", savedProfile.getCompany().getName());
    }
    @Test
    @DisplayName("đăng ký Recruiter thất bại : Email của Hr đã tồn tại trên hệ thống")
    void registerRecruiter_Failure_EmailExists() {
        String companyEmail = "admin@company.com";

        Mockito.when(userRepository.existsByEmail(registerRequestDTO.getEmail())).thenReturn(true);

        RuntimeException exception = Assertions.assertThrows(RuntimeException.class, () -> {
            authService.registerRecruiter(registerRequestDTO, companyEmail);
        });
        Assertions.assertEquals("Email đã được sử dụng", exception.getMessage());
        Mockito.verify(userRepository , Mockito.never()).save(Mockito.any(User.class));
    }
    @Test
    @DisplayName("Đăng ký Recruiter thất bại : Không tìm thấy tài khoản Doanh nghiệp đang thao tác")
    void registerRecruiter_Failure_CompanyUserNotFound() {
        String invalidCompanyEmail = "ghost_company@gmail.com";

        Mockito.when(userRepository.existsByEmail(registerRequestDTO.getEmail())).thenReturn(false);

        Mockito.when(userRepository.findByEmail(invalidCompanyEmail)).thenReturn(Optional.empty());

        RuntimeException exception = Assertions.assertThrows(RuntimeException.class, () -> {
            authService.registerRecruiter(registerRequestDTO, invalidCompanyEmail);
        });
        Assertions.assertEquals("Không tìm thấy tài khoản doanh nghiệp đang thao tác!" , exception.getMessage());
        Mockito.verify(userRepository , Mockito.never()).save(Mockito.any(User.class));
    }

    @Test
    @DisplayName("Đăng ký thất bại: Phải quăng lỗi RuntimeException khi Email đã được sử dụng")
    void register_Failure_EmailAlreadyExists() {
        Mockito.when(userRepository.existsByEmail(registerRequestDTO.getEmail())).thenReturn(true);

        RuntimeException exception = Assertions.assertThrows(RuntimeException.class, () -> {
            authService.register(registerRequestDTO);
        });
        Assertions.assertEquals("Email đã được sử dụng!" ,  exception.getMessage());
        Mockito.verify(userRepository , Mockito.never()).save(Mockito.any(User.class));
    }
}
