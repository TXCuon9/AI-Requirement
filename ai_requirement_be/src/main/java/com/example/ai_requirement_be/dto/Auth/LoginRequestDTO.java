package com.example.ai_requirement_be.dto.Auth;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequestDTO {
  @NotBlank(message = "Email không được để trống")
   @Email(message = "Email không đúng định dạng")
    public String email;

  @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

  public LoginRequestDTO() {

  }

  public LoginRequestDTO(String email, String password) {
      this.email = email;
      this.password = password;
  }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
