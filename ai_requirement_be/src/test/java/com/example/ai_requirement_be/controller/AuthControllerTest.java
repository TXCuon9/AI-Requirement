package com.example.ai_requirement_be.controller;

import com.example.ai_requirement_be.controller.Authendication.AuthController;
import com.example.ai_requirement_be.dto.Auth.AuthResponseDTO;
import com.example.ai_requirement_be.dto.Auth.LoginRequestDTO;
import com.example.ai_requirement_be.dto.Auth.RegisterRequestDTO;
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


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


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

    private RegisterRequestDTO  validRegisterRequestDTO;




    @BeforeEach
    void setUp() {
        validLoginRequestDTO = new LoginRequestDTO();
        validLoginRequestDTO.setEmail("lukaku@gmail.com");
        validLoginRequestDTO.setPassword("lukaku123");
        validRegisterRequestDTO = new RegisterRequestDTO();
        validRegisterRequestDTO.setEmail("lookatme@gmail.com");
        validRegisterRequestDTO.setPassword("lookatme123");
    }



    @Test
    @DisplayName("Nên đăng ký thành công khi email và password hợp lệ")
    void register_Sucess() throws Exception {
        String mockMessage = "Đăng ký tài khoản thành công!";

        Mockito.when(authService.register(Mockito.any(RegisterRequestDTO.class)))
                .thenReturn(mockMessage);
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Đăng ký tài khoản thành công!"));
    }

    @Test
    @DisplayName("Nên trả về lỗi 400 khi để trống emali hoặc mật khẩu lúc đăng ký ")
    void register_Failure_BlankField() throws Exception {
        RegisterRequestDTO  registerRequestDTO = new RegisterRequestDTO();
        registerRequestDTO.setEmail("");
        registerRequestDTO.setPassword(" ");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequestDTO)))
                .andExpect(status().isBadRequest());
                Mockito.verifyNoInteractions(authService);
    }

    @Test
    @DisplayName("Nên trả về lỗi 400 khi nhập email sai định dạng lúc đăng ký")
    void register_Failure_InvalidEmail() throws Exception {
        RegisterRequestDTO invalidRequest = new RegisterRequestDTO();
        invalidRequest.setEmail("sai_dinh_dang_email.com");
        invalidRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        Mockito.verifyNoInteractions(authService);
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
