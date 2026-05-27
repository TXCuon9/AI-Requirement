package com.example.ai_requirement_be.controller.Authendication;


import com.example.ai_requirement_be.dto.Auth.*;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.service.Authendication.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
     private final AuthService authService;
     public AuthController(AuthService authService) {
         this.authService = authService;
     }
         @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequestDTO registerRequestDTO) {
         String result = authService.register(registerRequestDTO);
         return ResponseEntity.ok(result);
     }
     @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
         AuthResponseDTO response = authService.login(loginRequestDTO);
         return ResponseEntity.ok(response);
     }
     @PostMapping("/refresh")
      public ResponseEntity<TokenRefreshResponseDTO> refreshToken(@Valid @RequestBody TokenRefreshRequestDTO requestDTO) {
         TokenRefreshResponseDTO response = authService.refreshToken(requestDTO);
         return ResponseEntity.ok(response);
     }
     // Tạo tài khoản cho Hr -> company
     @PostMapping("register/recruiter")
     public ResponseEntity<String> registerRecruiter(@Valid @RequestBody RegisterRequestDTO registerRequestDTO) {
         String result = authService.registerRecruiter(registerRequestDTO);
         return ResponseEntity.ok(result);
     }
     @PostMapping("/register/company")
    public ResponseEntity<String> registerCompany(@Valid @RequestBody RegisterRequestDTO registerRequestDTO) {
          String result = authService.registerCompany(registerRequestDTO);
          return ResponseEntity.ok(result);
     }
}
