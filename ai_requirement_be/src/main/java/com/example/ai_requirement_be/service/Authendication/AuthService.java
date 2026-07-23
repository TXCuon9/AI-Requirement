package com.example.ai_requirement_be.service.Authendication;

import com.example.ai_requirement_be.dto.Auth.*;
import com.example.ai_requirement_be.dto.RecruiterDto.RegisterProfileDTO;
import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import com.example.ai_requirement_be.entity.RecruiterManager.RecruiterProfile;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.UserManager.UserRole;
import com.example.ai_requirement_be.entity.UserManager.UserStatus;
import com.example.ai_requirement_be.repository.ICompanyRepository;
import com.example.ai_requirement_be.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
@Service
public class AuthService {
    private final IUserRepository userRepository;
    private final ICompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public AuthService(IUserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService , ICompanyRepository companyRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.companyRepository = companyRepository;
    }

    @Transactional
    public String register(RegisterRequestDTO registerRequestDTO) {
        if (userRepository.existsByEmail(registerRequestDTO.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }
        User user = new User(
                registerRequestDTO.getEmail(),
                passwordEncoder.encode(registerRequestDTO.getPassword()),
                UserRole.CANDIDATE
        );
        CandidateProfile candidateProfile = new CandidateProfile();
        candidateProfile.setUser(user);
        user.setCandidateProfile(candidateProfile);
        userRepository.save(user);
        return "Đăng ký tài khoản thành công";
    }

    // Tạo tài khoản cho Hr
    @Transactional
    public String registerRecruiter(RegisterRequestDTO registerRequestDTO , String companyUserEmail) {
        if (userRepository.existsByEmail(registerRequestDTO.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        // companyUserEmail -> ta lấy từ token Principal principal
        // Sau khi lấy được email nếu tìm thấy thì lưu vào một đối tượng user.
        User companyUser = userRepository.findByEmail(companyUserEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản doanh nghiệp đang thao tác!"));

        // Do có mối quan hệ hai chiều từ thằng User đó ta có thể get được công ty => mapped hai chiều
        Companies currentCompany = companyUser.getCompanies();

        if (currentCompany == null) {
            throw new RuntimeException("Tài khoản của bạn chưa được liên kết với hồ sơ công ty nào!");
        }

        User user = new User(
                registerRequestDTO.getEmail(),
                passwordEncoder.encode(registerRequestDTO.getPassword()),
                UserRole.RECRUITER
        );
        RecruiterProfile recruiterProfile = new RecruiterProfile();
        recruiterProfile.setUser(user);
        recruiterProfile.setCompany(currentCompany);
        recruiterProfile.setPosition("HR Manager");
        recruiterProfile.setCreatedAt(LocalDateTime.now());
        user.setRecruiterProfile(recruiterProfile);
        userRepository.save(user);
        return "Bạn đã đăng ký tài khoản hr thành công";
    }

    public String registerCompany(CompanyRegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email công ty đã tồn tại trên hệ thống");
        }
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.COMPANY);
        user.setStatus(UserStatus.PENDING);

        Companies companies = new Companies();
        companies.setUser(user);
        companies.setName(dto.getCompanyName() != null ? dto.getCompanyName() : "Công ty mới đăng ký");
        companies.setDescription(dto.getDescription());
        companies.setIndustry(dto.getIndustry());
        companies.setCompanySize(dto.getCompanySize());
        companies.setWebsite(dto.getWebsite());
        companies.setLocation(dto.getLocation());
        companies.setLogoUrl(dto.getLogoUrl());
        
        user.setCompanies(companies);

        userRepository.save(user);
        return "Vui lòng đợi Admin duyệt mới có thể đăng nhập";
    }

    public AuthResponseDTO login(LoginRequestDTO loginRequestDTO) {

        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không chính xác!"));

        if (user.getStatus() == UserStatus.BANNED) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        if(user.getStatus() == UserStatus.PENDING) {
            throw new RuntimeException("Tài khoản công ty đang chờ Quản trị viên duyệt, vui lòng quay lại sau!");
        }


        boolean isPasswordCorrect = passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPasswordHash());

        if (!isPasswordCorrect) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác!");
        }

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new AuthResponseDTO(
                accessToken,
                refreshToken,
                user.getEmail(),
                user.getRole().name()
        );

    }

    // Hàm đổi Refesh Token lấy cặp Token mới
    public TokenRefreshResponseDTO refreshToken(TokenRefreshRequestDTO tokenRefreshRequestDTO) {
        String currentRefreshToken = tokenRefreshRequestDTO.getRefeshToken();
        try {
            String email = jwtService.extractEmail(currentRefreshToken);
            if (email != null && jwtService.isTokenValid(currentRefreshToken, email)) {
                User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
                if (user.getStatus() == UserStatus.BANNED) {
                    throw new RuntimeException("Tài khoản đã bị khóa");
                }
                String newAccessToken = jwtService.generateToken(user);
                String newRefreshToken = jwtService.generateRefreshToken(user);

                return new TokenRefreshResponseDTO(newAccessToken, newRefreshToken);
            }
        } catch (Exception e) {
            throw new RuntimeException("Refresh Token không hợp lệ hoặc đã hết hạn!");
        }
        throw new RuntimeException("Refresh Token không hợp lệ!");
    }
}
