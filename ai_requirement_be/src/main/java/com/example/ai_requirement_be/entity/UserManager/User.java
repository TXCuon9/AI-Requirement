package com.example.ai_requirement_be.entity.UserManager;
import com.example.ai_requirement_be.entity.CandidateManager.CandidateProfile;
import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import com.example.ai_requirement_be.entity.RecruiterManager.RecruiterProfile;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name="users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false , unique = true , length = 255 , name="email")
    private String email;

    @Column(name="password_hash" , nullable = false , length = 255)
    private String passwordHash;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false , name="role" , columnDefinition ="users_role_enum")
    private UserRole role;

    @Column(length = 50 , name="provider")
    private String provider;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name="status" , columnDefinition ="users_status_enum")
    private UserStatus status =  UserStatus.ACTIVE;

    @CreationTimestamp
    @Column(name="created_at" , updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "user" , cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    private CandidateProfile candidateProfile;

    @OneToOne(mappedBy = "user" , cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    private Companies companies;

    @OneToOne(mappedBy = "user" , cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    private RecruiterProfile recruiterProfile;



    public User() {

    }

    public User(Long id, String email, String passwordHash, UserRole role, String provider,
                UserStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.provider = provider;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public User(String email, String passwordHash, UserRole role) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.provider = "local";
        this.status = UserStatus.ACTIVE;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }

    @Override
    public String getPassword() {
        return this.passwordHash; // Spring Security lấy pass ở đây để đối chiếu khi login
    }

    @Override
    public String getUsername() {
        return this.email; // Sử dụng email làm username để đăng nhập
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.status != UserStatus.BANNED; //
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Mật khẩu không hết hạn
    }

    @Override
    public boolean isEnabled() {
        return this.status == UserStatus.ACTIVE; // Chỉ cho phép đăng nhập nếu trạng thái active
    }

    public CandidateProfile getCandidateProfile() {
        return candidateProfile;
    }

    public void setCandidateProfile(CandidateProfile candidateProfile) {
        this.candidateProfile = candidateProfile;
    }

    public Companies getCompanies() {
        return companies;
    }

    public void setCompanies(Companies companies) {
        this.companies = companies;
    }

    public RecruiterProfile getRecruiterProfile() {
        return recruiterProfile;
    }

    public void setRecruiterProfile(RecruiterProfile recruiterProfile) {
        this.recruiterProfile = recruiterProfile;
    }


}
