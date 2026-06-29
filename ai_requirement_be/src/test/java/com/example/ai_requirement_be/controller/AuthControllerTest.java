package com.example.ai_requirement_be.controller;

import com.example.ai_requirement_be.controller.Authendication.AuthController;
import com.example.ai_requirement_be.dto.Auth.AuthResponseDTO;
import com.example.ai_requirement_be.dto.Auth.LoginRequestDTO;
import com.example.ai_requirement_be.repository.IUserRepository;
import com.example.ai_requirement_be.service.Authendication.AuthService;
import com.example.ai_requirement_be.service.Authendication.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService  authService;

    @MockitoBean
    private JwtService jwtService;
    @MockitoBean
    private IUserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private LoginRequestDTO  validLoginRequestDTO;

    @BeforeEach
    void setUp() {
        validLoginRequestDTO = new LoginRequestDTO();
        validLoginRequestDTO.setEmail("lukaku@gmail.com");
        validLoginRequestDTO.setPassword("lukaku123");
    }

    @Test
    @DisplayName("Nên đăng nhập thành công khi thông tin email và password hợp lệ")
    void login_Success() throws Exception {
        AuthResponseDTO mockResponse = new AuthResponseDTO();
        mockResponse.setAccessToken("mock-jwt-token-xyz");
        mockResponse.setRefreshToken("Bearer");

        Mockito.when(authService.login(Mockito.any(LoginRequestDTO.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validLoginRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mock-jwt-token-xyz"))
                .andExpect(jsonPath("$.refreshToken").value("Bearer"));
    }
    @Test
    @DisplayName("Nên trả về lỗi 400 Bad Request khi để trống Email hoặc Mật khẩu")
    void login_BadRequest() throws Exception {

        LoginRequestDTO invalidRequestDto = new LoginRequestDTO();
        invalidRequestDto.setEmail("");
        invalidRequestDto.setPassword(" ");

        mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequestDto)))
                .andExpect(status().isBadRequest());
                Mockito.verifyNoInteractions(authService);
    }

    @Test
    @DisplayName("Nên trả về lỗi 400 Bad Request khi nhập Email sai định dạng")
    void login_BadRequest_Email() throws Exception {
        LoginRequestDTO invalidRequestDto = new LoginRequestDTO();
        invalidRequestDto.setEmail("lukakugmail.com");
        invalidRequestDto.setPassword("12345678");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequestDto)))
                .andExpect(status().isBadRequest());

        Mockito.verifyNoInteractions(authService);
    }
}
