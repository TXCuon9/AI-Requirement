package com.example.ai_requirement_be.service.Authendication;

import com.example.ai_requirement_be.dto.Auth.*;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.UserManager.UserRole;
import com.example.ai_requirement_be.entity.UserManager.UserStatus;
import com.example.ai_requirement_be.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;
@Service
public class AuthService {
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public AuthService(IUserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequestDTO registerRequestDTO) {
        if (userRepository.existsByEmail(registerRequestDTO.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }
        User user = new User(
                registerRequestDTO.getEmail(),
                passwordEncoder.encode(registerRequestDTO.getPassword()),
                UserRole.CANDIDATE
        );
        userRepository.save(user);
        return "Đăng ký tài khoản thành công";
    }

    // Tạo tài khoản cho Hr
    public String registerRecruiter(RegisterRequestDTO registerRequestDTO) {
        if (userRepository.existsByEmail(registerRequestDTO.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        User user = new User(
                registerRequestDTO.getEmail(),
                passwordEncoder.encode(registerRequestDTO.getPassword()),
                UserRole.RECRUITER
        );
        userRepository.save(user);
        return "Bạn đã đăng ký tài khoản hr thành công";
    }

    public String registerCompany(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email công ty đã tồn tại trên hệ thống");
        }
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.COMPANY);
        user.setStatus(UserStatus.PENDING);

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
